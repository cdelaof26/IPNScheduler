let generatorRunning = false;
let lastState = 0;
let progressState = 0;

let gx = {};
let gxInverse = {};
let maxGXValue = 0;
let minima = 10000;
let minimaHistoric = [];

let stateUpdaterId = -1;


const scheduleCSVHeaders = "Grupo,Materia,Profesor,Lunes,Martes,Miércoles,Jueves,Viernes,Intercambiable";
class Schedule {
    id;
    minima;
    courses;

    constructor(id, minima, courses) {
        this.id = id;
        this.minima = minima;
        this.courses = courses;
    }
}
let generatedSchedules = [];
let generated_html = [];

function scheduleToCSV(schedule) {
    let csvString = `Horario #${schedule.id}, , , , , , , ,Ranking: ${schedule.minima}\r\n`;
    for (let course of schedule.courses)
        if (course[0] === undefined) {
            course.toStringIncludesPreference = false;
            csvString += course.toString() + ",No" + "\r\n";
            course.toStringIncludesPreference = true;
        } else {
            for (let alt of course) {
                alt.toStringIncludesPreference = false;
                csvString += alt.toString() + ",Si" + "\r\n";
                alt.toStringIncludesPreference = true;
            }
        }

    return csvString;
}

function exportSchedules() {
    let csvString = scheduleCSVHeaders + "\r\n";
    for (let schedule of generatedSchedules)
        csvString += scheduleToCSV(schedule) + " , , , , , , , , \r\n".repeat(2);

    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    link.download = 'Horarios.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function newState(text, tickIcon) {
    let div = document.createElement('div');

    let span = document.createElement('span');
    span.className = tickIcon ? 'text-lime-500 dark:text-lime-400' : 'text-amber-500 dark:text-amber-400';
    span.textContent = tickIcon ? '✓' : "[PR]";
    div.appendChild(span);

    let span1 = document.createElement('span');
    span1.className = 'ps-3';
    span1.textContent = text;
    div.appendChild(span1);

    setTimeout(() => div.scrollIntoView(), 100);

    return div;
}

function updateState() {
    if (!generatorRunning) {
        document.getElementById("generatorButtonManagerText").innerText = "Iniciar operación";
        clearInterval(stateUpdaterId);
        return;
    }

    if (lastState === progressState)
        return;

    lastState++;
    let text = "";
    let completed = lastState % 2 === 0;
    switch (lastState) {
        case 1:
            text = "Asignando identificadores...";
        break;
        case 2:
            text = "Identificadores asignados [g(x) creada]";
        break;
        case 3:
            text = "Buscando mínimo...";
        break;
        case 4:
            text = "Mínimo encontrado: " + minima;
        break;
        case 5:
            text = "Generando horarios...";
        break;
        case 6:
            text = "Horarios generados";
            document.getElementById("generatorButtonManagerText").innerText = "Iniciar operación";
            generatorRunning = false;
        break;
    }

    document.getElementById("progressLabel").appendChild(newState(text, completed));
}

function assignIDs() {
    progressState++;

    let allHours = [];
    for (let courseIndex = 0; courseIndex < coursesOptions.length; courseIndex++) {
        const course = coursesOptions[courseIndex];
        const courseHours = course.getHours();

        const index = allHours.indexOf(courseHours);
        if (index !== -1) {
            const gxOutput = [...gx["" + index]];
            gxOutput.push(course.getPreferenceValue());
            gx["" + index] = gxOutput;

            const gxInverseOutput = [...gxInverse["" + index]];
            gxInverseOutput.push(courseIndex);
            gxInverse["" + index] = gxInverseOutput;

            continue;
        }

        allHours.push(courseHours);
        gx["" + maxGXValue] = [course.getPreferenceValue()];
        gxInverse["" + maxGXValue] = [courseIndex];
        maxGXValue++;
    }

    console.log("gx-gxInverse", gx, gxInverse);

    progressState++;
}

function getCourse(xs, gxs) {
    // Given an id and the preference level, returns the course
    const index = gx["" + xs].indexOf(gxs);
    return coursesOptions[gxInverse["" + xs][index]];
}

function getCourses(xs, gxs) {
    // Given an id and the preference level, returns all the courses associated
    const indexes = [];
    // console.log(gxs, gx["" + xs])
    for (let i = 0; i < gx["" + xs].length; i++)
        if (gx["" + xs][i] === gxs)
            indexes.push(i);

    // console.log("indexes", indexes)
    if (indexes.length === 1)
        return coursesOptions[gxInverse["" + xs][indexes[0]]];

    let courses = [];
    for (let index of indexes)
        courses.push(coursesOptions[gxInverse["" + xs][index]]);

    return courses;
}

function getClasses(xs, gxs, returnSingle) {
    const classes = [];
    for (let i = 0; i < xs.length; i++)
        classes[i] = returnSingle ? getCourse(xs[i], gxs[i]) : getCourses(xs[i], gxs[i]);

    return classes;
}

function getAllHoursInADay(dayIndex, classes) {
    const hours = [];
    for (let c of classes) {
        const hour = c.getHour(dayIndex);
        if (hour !== "-")
            hours.push(hour);
    }

    hours.sort((h1, h2) => {
        const [hour1, minute1] = timeHHMMAsNumberArray(getHourIntervalPart(h1, true));
        const [hour2, minute2] = timeHHMMAsNumberArray(getHourIntervalPart(h2, true));

        if (hour1 > hour2 || hour1 === hour2 && minute1 > minute2)
            return 1;

        if (hour1 < hour2 || hour1 === hour2 && minute1 < minute2)
            return -1;

        return 0;
    });


    return hours;
}

function isThereAOverlap(h1, h2) {
    const [h1EndHour, h1EndMinute] = timeHHMMAsNumberArray(getHourIntervalPart(h1, false));
    const [h2StartHour, h2StartMinute] = timeHHMMAsNumberArray(getHourIntervalPart(h2, true));

    return h1EndHour > h2StartHour || h1EndHour === h2StartHour && h1EndMinute > h2StartMinute;
}

function gapsInBetween(h1, h2) {
    const [hour1, minute1] = timeHHMMAsNumberArray(getHourIntervalPart(h1, false));
    const [hour2, minute2] = timeHHMMAsNumberArray(getHourIntervalPart(h2, true));

    const hourDifference = Math.abs(hour1 - hour2);
    const minuteDifference = Math.abs(minute1 - minute2);
    const difference = hourDifference + minuteDifference / 60;

    const [gapHour, gapMinute] = timeHHMMAsNumberArray(configController.getGapBetweenClasses());
    const gap = gapHour + gapMinute / 60;

    return Math.trunc(difference / gap);
}

function getSpaceBetweenClassesInADay(dayIndex, classes) {
    const dayHours = getAllHoursInADay(dayIndex, classes);
    if (dayHours.length === 0)
        // Setting to 0 would mean that there are no gaps between classes,
        // but that will give that schedule a higher preference.
        // Some folks might prefer not having to go a whole day... IMPLEMENTED
        return configController.getPreferAllDayEmptySchedules() === -1 ? classes.length : configController.getPreferAllDayEmptySchedules() === 0 ? -classes.length : -(classes.length * 2);

    // dayHours is sorted by start time: early to late

    let spacesInBetween = 0;
    let i = 0, j = 1;
    while (j < dayHours.length) {
        if (dayHours[i] === dayHours[j] || isThereAOverlap(dayHours[i], dayHours[j]))
            return -1;

        spacesInBetween += gapsInBetween(dayHours[i], dayHours[j]);
        i++;
        j++;
    }


    return spacesInBetween;
}

function getSpaceBetweenClasses(xs, gxs) {
    const classes = getClasses(xs, gxs, true);
    const gapsPerDay = [];
    for (let i = 0; i < 5; i++) {
        const gapsInADay = getSpaceBetweenClassesInADay(i, classes);
        if (gapsInADay === -1)
            return [-1, -1, -1, -1, -1];

        gapsPerDay[i] = gapsInADay;
    }

    return gapsPerDay;
}

function generateXS() {
    // This function generates a xs vector. A xs value is
    // a random-selected id for a group of classes.

    const xs = [];
    let i = 0;
    while (i < configController.getCoursesPerSchedule()) {
        const x = Math.trunc(Math.random() * maxGXValue);
        if (xs.indexOf(x) !== -1)
            continue;

        xs[i] = x;
        i++;
    }

    return xs;
}

let max_fix_attempts = 50;

function evalXS(xs) {
    // This function takes a xs vector (random-selected schedule ids)
    // and "evaluates them", which is basically choice a random preference.

    // An experimental bug fix is implemented to try to mitigate duplicated
    // classes in the same schedule.

    const gxs = [];

    // This fix makes use of another array to store the names of the classes already included.
    const classes = [];

    // for (let x of xs) {
    let i = 0, k = 0;

    function found_course(name, pref_lvl) {
        if (classes.indexOf(name) === -1) {
            classes.push(name);
            gxs.push(pref_lvl);
            i++;
            k = 0;
            return false;
        }

        return true;
    }

    while (i < xs.length) {
        const x = xs[i];
        const index = Math.floor(Math.random() * gx["" + x].length);
        const preference_level = gx["" + x][index];

        const courses = getCourses(x, preference_level); // this might return single elements
        if (courses.length === undefined) {
            if (!found_course(courses.getName().trim().toLowerCase(), preference_level))
                continue;

        } else {
            let duplicated_course = false;
            for (let course of courses) {
                duplicated_course = found_course(course.getName().trim().toLowerCase(), preference_level);
                if (!duplicated_course)
                    break;
            }

            if (!duplicated_course)
                continue;
        }

        // console.log("found dup", course_name);
        k++;
        // There might not be enough courses to avoid two identical names from being added.
        if (k > max_fix_attempts)
            return [];
    }

    return gxs;
}

function f(returnData) {
    // TODO: Uncomment for production
    if (maxGXValue < configController.getCoursesPerSchedule() + 1) {
        generatorRunning = false;
        setError(`Se requieren de al menos ${configController.getCoursesPerSchedule() + 1} materias con diferentes horarios`);
        if (!returnData)
            return 10000;
        return [10000, [], []];
    }

    const xs = generateXS();  // x
    const gxs = evalXS(xs);  // g(x)
    if (gxs.length === 0) {
        if (!returnData)
            return 10000;
        return [10000, [], []];
    }

    const gapsPerDay = getSpaceBetweenClasses(xs, gxs);
    if (gapsPerDay[0] === -1) {
        if (!returnData)
            return 10000;
        return [10000, [], []];
    }

    let y = 0;
    for (let gxEval of gxs)
        y += gxEval;
    for (let gaps of gapsPerDay)
        y += gaps;

    if (!returnData)
        return y;

    // Somehow this can sort in place...
    const tmpObj = {};
    let i;
    for (i = 0; i < xs.length; i++)
        tmpObj["" + xs[i]] = gxs[i];

    i = 0;
    for (let key in tmpObj) {
        xs[i] = Number(key);
        gxs[i] = tmpObj[key];
        i++;
    }

    return [y, xs, gxs];
}

function findMinima() {
    progressState++;

    let gen = 0;
    let ind = 0;
    while (gen < configController.getGenerationsToFindMinima() && generatorRunning) {
        while (ind < configController.getCombinationsPerPopulation() && generatorRunning) {
            const evaluation = f(false);
            if (evaluation < minima) {
                minimaHistoric.push(evaluation);
                minima = evaluation;
            }
            ind++;
        }

        gen++;
    }

    if (minima > 50 && generatorRunning) {
        generatorRunning = false;
        setError(`No fue posible encontrar un horario óptimo ${minima === 10000 ? '' : '[valor más próximo:' + minima + ']'}`);
        return;
    }

    progressState++;
}

function newViewOnlyRow(course, canSwap, color) {
    course.editable = false;

    let tr = document.createElement('tr');
    tr.className = 'bg-sidebar-0 dark:bg-sidebar-1 ' + (canSwap ? color : '');

    tr.appendChild(newTD(0, course.getGroup(), true));
    tr.appendChild(newTD(1, course.getName(), false));
    tr.appendChild(newTD(1, course.getTeacher(), false));

    for (let i = 0; i < 5; i++)
        tr.appendChild(newTD(1, course.getHour(i), true));

    tr.appendChild(newTD(2, canSwap ? "Si" : "No", false));

    return tr;
}

function newTH(text, className) {
    let th = document.createElement('th');
    th.className = className;
    th.textContent = text;
    return th
}

function getColor(id) {
    switch (id) {
        case 0:
            return 'text-lime-600 dark:text-lime-500';
        case 1:
            return 'text-emerald-600 dark:text-emerald-500';
        case 2:
            return 'text-cyan-600 dark:text-cyan-500';
        case 3:
            return 'text-blue-600 dark:text-blue-400';
        case 4:
            return 'text-violet-600 dark:text-violet-400';
        case 5:
            return 'text-fuchsia-600 dark:text-fuchsia-300';
        case 6:
            return 'text-rose-800 dark:text-rose-400';
        case 7:
            return 'text-pink-600 dark:text-pink-400';
        case 8:
            return 'text-purple-600 dark:text-purple-400';
        default:
            return 'text-indigo-600 dark:text-indigo-300';
    }
}

function newSchedule(id, evaluation) {
    let div1 = document.createElement('div');
    div1.className = 'rounded-xl w-max p-4';

    let div2 = document.createElement('div');
    div2.className = 'flex justify-between';

    let p1 = document.createElement('p');
    p1.textContent = 'Horario #' + (id + 1);
    div2.appendChild(p1);

    let p2 = document.createElement('p');
    p2.textContent = 'Ranking: ' + evaluation[0];
    div2.appendChild(p2);
    div1.appendChild(div2);

    let table = document.createElement('table');
    table.className = 'table-auto';

    let thead = document.createElement('thead');

    let tr = document.createElement('tr');
    tr.appendChild(newTH('Grupo'));
    tr.appendChild(newTH('Nombre', 'text-left'));
    tr.appendChild(newTH('Profesor', 'text-left'));
    for (let t of ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Intercambiable'])
        tr.appendChild(newTH(t));

    let tbody = document.createElement('tbody');

    // console.log("about to eval");
    let color = Math.trunc(Math.random() * 10);
    const classes = getClasses(evaluation[1], evaluation[2], false);
    generatedSchedules.push(new Schedule(id, evaluation[0], classes));

    for (let c of classes) {
        // console.log("c", c, c[0])
        if (c[0] === undefined)
            tbody.appendChild(newViewOnlyRow(c, false, ""));
        else {
            for (let sc of c)
                tbody.appendChild(newViewOnlyRow(sc, true, getColor(color)));

            color++;
            if (color >= 9)
                color = 0;
        }
    }

    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    div1.appendChild(table);

    return div1;
}

function createSchedules() {
    progressState++;

    let createdSchedules = 0;
    let varMinima = minima;

    minimaHistoric.sort((a, b) => b - a);
    const minimaInHistoric = minimaHistoric.indexOf(minima);
    if (minimaInHistoric !== -1)
        minimaHistoric.splice(minimaInHistoric, 1);

    console.log("min", minima, minimaHistoric);

    const div = document.getElementById("schedules");

    // while (createdSchedules < 10) {
    while (createdSchedules < configController.getSchedulesToGenerate()) {
        const evaluation = f(true);
        if (evaluation[0] !== varMinima)
            continue;

        // Initially I thought about checking the same minima thrice just in case some schedules had the same
        // minima but different configuration. However, I couldn't figure out how to do that,
        // so I guess the user will need to run this several times...
        const e = newSchedule(createdSchedules, evaluation);
        generated_html.push(e);
        div.appendChild(e);
        createdSchedules++;

        varMinima = minimaHistoric.pop();
        if (varMinima === undefined) {
            if (createdSchedules < configController.getSchedulesToGenerate())
                setError(`No fue posible crear los ${configController.getSchedulesToGenerate()} horarios solicitados`);
            break;
        }
    }

    progressState++;
}

function removeAllFrom(elementId) {
    const htmlElement = document.getElementById(elementId);
    while (htmlElement.firstChild)
        htmlElement.removeChild(htmlElement.lastChild);
}

function manageGenerator() {
    const buttonText = document.getElementById("generatorButtonManagerText");

    if (generatorRunning) {
        buttonText.innerText = "Iniciar operación";
        generatorRunning = false;
        return;
    }

    removeAllFrom("schedules");
    generated_html = [];

    removeAllFrom("progressLabel");
    document.getElementById("progressLabel").appendChild(newState("Listo", true));

    generatedSchedules = [];

    buttonText.innerText = "Parar operación";
    generatorRunning = true;
    lastState = 0;
    progressState = 0;
    gx = {};
    gxInverse = {};
    maxGXValue = 0;
    minima = 10000;
    minimaHistoric = [];

    setTimeout(() => {
        assignIDs();
        if (!generatorRunning) return;
        findMinima();
        if (!generatorRunning) return;
        createSchedules();
    }, 10);

    stateUpdaterId = setInterval(updateState, 100);
}

function reload_generated_html() {
    const div = document.getElementById("schedules");
    generated_html.forEach(e => {
        div.appendChild(e);
    });
}

function strip_schedules() {
    if (generated_html.length === 0) {
        setError("No hay nada que mostrar")
        return;
    }

    const component = document.getElementById("schedules");
    component.parentElement.removeChild(component);

    const div = document.createElement("div");
    div.className = "fixed flex flex-col z-10 w-full h-full p-4 backdrop-blur-3xl bg-body-0/90 dark:bg-body-1/50";

    const close_button = document.createElement('button');
    close_button.addEventListener('click', () => {
        document.getElementById("schedules-container").append(component);
        div.parentElement.removeChild(div);
    });
    close_button.setAttribute('class', "w-fit h-fit p-1 rounded-xl");

    const icon = document.createElement('script');
    icon.setAttribute('src', "svg/x_mark.js");
    icon.setAttribute('classData', "self-center h-8");
    close_button.appendChild(icon);

    div.appendChild(close_button);
    div.appendChild(component);

    document.body.appendChild(div);
}


const preferences = ['Máxima preferencia', 'Fuertemente preferido', 'Moderadamente preferido', 'Moderadamente evitar', 'Preferentemente evitar', 'Sin preferencia'];
const preferencesValues = [-1, 0, 1, 2, 3, 4];
const csvHeaders = "Grupo,Materia,Profesor,Lunes,Martes,Miércoles,Jueves,Viernes,Preferencia";
const escom_hours = ["07:00-08:30", "08:30-10:00", "10:30-12:00", "12:00-13:30", "13:30-15:00", "15:00-16:30", "16:30-18:00", "18:30-20:00", "20:00-21:30"]

class Course {
    editable = true;
    #group = '';
    #name = '';
    #teacher = '';
    #hours = ['', '', '', '', ''];
    #preference = '';
    #preferenceValue = -1;
    #validHours = [true, true, true, true, true]
    #validPreference = false;

    show = true;
    available = true;
    selected = false;

    toStringIncludesPreference = true;

    constructor(data, editable) {
        if (data === null || data === undefined)
            return;

        this.editable = editable === undefined ? true : editable;
        if (!this.#setSAESCopyPastedData(data))
            return;

        this.editable = editable === undefined ? true : editable;
        const split = data.split("\t");
        if ((split.length - 1) === 8) {
            const preferenceValue = Number(split[8]);
            if (/^-?\d$/g.test("" + preferenceValue))
                this.setPreference(preferences[preferencesValues.indexOf(preferenceValue)]);
        }
    }

    #setSAESCopyPastedData(data) {
        if (typeof data !== "string")
            return false;

        if (!data.includes("\t"))
            return false;

        const splited = data.split("\t");
        if (splited.length > 3 && (/^\d+$/g.test(splited[3]) || splited[3] === "X"))
            splited.splice(3, 2);

        for (let i = 0; i < splited.length; i++) {
            switch (i) {
                case 0:
                    this.setGroup(splited[i]);
                break;
                case 1:
                    this.setName(splited[i]);
                break;
                case 2:
                    this.setTeacher(splited[i]);
                break;
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    this.setHour(i - 3, splited[i]);
                break;
            }
        }

        reloadAllCollectedData();
        const e = document.getElementById("data-collector-container");
        if (e !== null)
            e.scrollLeft = e.offsetWidth;

        return true;
    }

    setGroup(group) {
        if (!this.#setSAESCopyPastedData(group))
            this.#group = group;
    }

    getGroup() {
        return this.#group;
    }

    setName(name) {
        if (!this.#setSAESCopyPastedData(name))
            this.#name = name;
    }

    getName() {
        return this.#name;
    }

    setTeacher(teacher) {
        if (!this.#setSAESCopyPastedData(teacher))
            this.#teacher = teacher;
    }

    getTeacher() {
        return this.#teacher;
    }

    setHour(id, hour) {
        if (this.#setSAESCopyPastedData(hour))
            return;

        if (typeof id !== "number" || typeof hour !== "string")
            return;

        if (id > this.#hours.length || id < 0)
            return;

        if (hour.trim() === "-")
            hour = "";

        this.#hours[id] = hour.trim();
        this.#validHours[id] = this.#hours[id].length === 0;
        if (this.#validHours[id] || !/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/g.test(hour))
            return;

        const hours = hour.split("-");
        const [startHour, startMinute] = timeHHMMAsNumberArray(hours[0]);
        const [endHour, endMinute] = timeHHMMAsNumberArray(hours[1]);

        if (startHour > 24 || startMinute > 59 || endHour > 24 || endMinute > 59)
            return;

        this.#validHours[id] = endHour > startHour || startHour === endHour && endMinute > startMinute;
    }

    getHour(id) {
        if (typeof id !== "number" || id > this.#hours.length || id < 0)
            return "";

        return this.#hours[id].trim().length === 0 ? "-" : this.#hours[id];
    }

    getHours() {
        return this.getHour(0) + this.getHour(1) + this.getHour(2) + this.getHour(3) + this.getHour(4);
    }

    setPreference(preference) {
        if (typeof preference !== "string")
            return;

        const prefIndex = preferences.indexOf(preference);

        this.#preference = preference;
        this.#validPreference = prefIndex !== -1;
        if (this.#validPreference)
            this.#preferenceValue = preferencesValues[prefIndex];
    }

    getPreference() {
        return this.#preference;
    }

    getPreferenceValue() {
        return this.#preferenceValue;
    }

    hasValidPreference() {
        return this.#validPreference;
    }

    isValid() {
        if (typeof this.#group !== "string" || typeof this.#name !== "string" || typeof this.#teacher !== "string")
            return "Grupo, nombre o profesor inválido (no es una cadena)";

        if (this.#group.trim().length === 0 || this.#name.trim().length === 0 || this.#teacher.trim().length === 0)
            return "Grupo, nombre o profesor vacío";

        let allEmpty = true;
        for (let i = 0; i < this.#hours.length; i++) {
            if (!this.#validHours[i])
                return `Hora inválida: '${this.#hours[i]}'; El valor debe tener la forma HH:MM-HH:MM donde HH:MM debe ser formato de 24 horas; La hora de termino debe ser posterior a la de inicio`;

            allEmpty = allEmpty && this.#hours[i].trim().length === 0;
        }

        if (allEmpty)
            return "Debe haber al menos una hora definida a la semana";

        if (!this.#validPreference)
            return "Preferencia inválida";

        return "";
    }

    toString() {
        let hours = `${this.getHour(0)},${this.getHour(1)},${this.getHour(2)},${this.getHour(3)},${this.getHour(4)}`;
        hours = hours.replaceAll(",-", ",");
        if (this.toStringIncludesPreference)
            return `${this.#group},${this.#name},${this.#teacher},${hours},${this.#preferenceValue}`;

        return `${this.#group},${this.#name},${this.#teacher},${hours}`;
    }

    clone() {
        return new Course(this.toString().replaceAll(",", "\t"), true);
    }

    equals(g) {
        // User might've changed the hours or preference...
        return g.getGroup() === this.#group && g.getName() === this.#name && g.getTeacher() === this.#teacher;
    }
}

let coursesOptions = [];

let scrollNewElementIntoView = true;
let loadAsPossibleCourse = false;
let autoReloadData = true;
let showUnavailable = true;

function reloadAllCollectedData() {
    if (!autoReloadData)
        return;

    // Not the most efficient way to update a row, but you gotta take in account that this a 3-day project
    const userSchedule = document.getElementById("userSchedule");
    if (userSchedule === null || userSchedule === undefined)
        return;

    let data = loadAsPossibleCourse ? possibleCourses : coursesOptions;

    for (let i = 0; i < data.length; i++) {
        const e = document.getElementById("r" + i);
        if (e === null || e === undefined)
            continue;

        userSchedule.removeChild(e);
    }

    for (let i = 0; i < data.length; i++) {
        if (!showUnavailable && !data[i].available || !data[i].show)
            continue;

        userSchedule.appendChild(data[i].editable ? newEditableRow(i) : newNonEditableRow(i));
    }
}

function preferenceSelector(index) {
    const content = coursesOptions[index].hasValidPreference() ? coursesOptions[index].getPreference() : 'Seleccionar...';
    return preference_selector(content, (event) => coursesOptions[index].setPreference(event.target.value));
}

function createHourInput(dayIndex, index) {
    const value = coursesOptions[index].getHour(dayIndex) === "-" ? "" : coursesOptions[index].getHour(dayIndex);
    const func = (event) => coursesOptions[index].setHour(dayIndex, event.target.value);

    if (document.getElementById("hour-input-mode").value !== "free") {
        const comp = escom_hour_input(func);
        const valid_hour = escom_hours.includes(value);
        comp.querySelector("select").value = valid_hour ? value : "-";
        if (!valid_hour)
            coursesOptions[index].setHour(dayIndex, "-");

        return comp;
    }

    return hour_input(value, func);
}

function newTD(side, text, centerText) {
    // side: 0 (left), 1 (middle), 2 (right)
    const td = document.createElement('td');
    td.className = 'p-4 ' + (centerText ? "text-center " : "") + (side === 0 ? "rounded-l-xl" : side === 1 ? "" : "rounded-r-xl");
    td.innerText = text;
    return td;
}

function newActionButtons(index, editing) {
    let td = document.createElement('td');
    td.className = 'rounded-r-xl pr-4 py-4';

    let div = document.createElement('div');
    div.className = 'flex justify-center';
    td.appendChild(div);

    if (loadAsPossibleCourse) {
        let button = document.createElement('button');
        button.setAttribute('id', 'r' + index + 'btn');
        button.className = 'self-center w-7 h-7 border-2 text-lg';
        button.textContent = possibleCourses[index].selected ? '✓' : '';
        button.onclick = () => {
            possibleCourses[index].selected = !possibleCourses[index].selected;
            button.textContent = possibleCourses[index].selected ? '✓' : '';
            autoReloadData = false;
            if (possibleCourses[index].selected)
                coursesOptions.push(possibleCourses[index].clone());
            else {
                for (let i = 0; i < coursesOptions.length; i++)
                    if (coursesOptions[i].equals(possibleCourses[index])) {
                        coursesOptions.splice(i, 1);
                        break;
                    }
            }

            autoReloadData = true;
        }
        div.appendChild(button);

        return td;
    }

    const td1 = action_buttons(
        editing ? "rounded-lg bg-ipn-0 text-white" : "",
        () => {
            const actualRow = document.getElementById("r" + index);

            if (coursesOptions[index].editable) {
                const validData = coursesOptions[index].isValid();
                if (validData !== "") {
                    setError(validData);
                    return;
                }
            }

            actualRow.replaceWith(coursesOptions[index].editable ? newNonEditableRow(index) : newEditableRow(index));
        },
        () => {
            const userSchedule = document.getElementById("userSchedule");
            if (userSchedule === null || userSchedule === undefined)
                return;

            for (let i = 0; i < coursesOptions.length; i++) {
                const e = document.getElementById("r" + i);
                if (e !== null)
                    userSchedule.removeChild(e);
            }

            coursesOptions.splice(index, 1);
            scrollNewElementIntoView = false;
            for (let i = 0; i < coursesOptions.length; i++)
                userSchedule.appendChild(coursesOptions[i].editable ? newEditableRow(i) : newNonEditableRow(i));

            scrollNewElementIntoView = true;
        }
    );

    td1.children[0].children[0].appendChild(r_pencil("size-5"));
    td1.children[0].children[1].appendChild(r_trash("size-5"));

    return td1;
}

function newNonEditableRow(index) {
    const data = loadAsPossibleCourse ? possibleCourses : coursesOptions;

    if (index > data.length)
        return;

    data[index].editable = false;

    const tr = document.createElement('tr');
    tr.setAttribute("id", "r" + index);
    tr.className = 'bg-body-0 dark:bg-body-1';

    tr.appendChild(newTD(0, data[index].getGroup(), true));
    tr.appendChild(newTD(1, data[index].getName(), false));
    tr.appendChild(newTD(1, data[index].getTeacher(), false));

    for (let i = 0; i < 5; i++)
        tr.appendChild(newTD(1, data[index].getHour(i), true));

    if (!loadAsPossibleCourse)
        tr.appendChild(newTD(1, data[index].getPreference(), true));
    tr.appendChild(newActionButtons(index, false));

    return tr;
}

function newEditableRow(index) {
    if (index > coursesOptions.length)
        return;

    coursesOptions[index].editable = true;

    const tr = editable_table_row(
        index,
        coursesOptions[index].getGroup(), (event) => coursesOptions[index].setGroup(event.target.value),
        coursesOptions[index].getName(), (event) => coursesOptions[index].setName(event.target.value),
        coursesOptions[index].getTeacher(), (event) => coursesOptions[index].setTeacher(event.target.value)
    );

    tr.appendChild(createHourInput(0, index));
    tr.appendChild(createHourInput(1, index));
    tr.appendChild(createHourInput(2, index));
    tr.appendChild(createHourInput(3, index));
    tr.appendChild(createHourInput(4, index));

    tr.appendChild(preferenceSelector(index));

    tr.appendChild(newActionButtons(index, true));
    if (scrollNewElementIntoView)
        setTimeout(() => tr.scrollIntoView(), 100);

    const e = document.getElementById("data-collector-container");
    if (e !== null)
        e.scrollLeft = 0;

    return tr;
}

function createNewRow() {
    const userSchedule = document.getElementById("userSchedule");
    if (userSchedule === null || userSchedule === undefined)
        return;

    const index = coursesOptions.length;
    coursesOptions.push(new Course());

    userSchedule.appendChild(newEditableRow(index));
}

function validCSV(data) {
    return data.length !== 0 && data.includes("\r\n");
}

function isValidCSV(data) {
    return validCSV(data) && data.split("\r\n")[0] === csvHeaders;
}

function is_collected_data_valid() {
    if (!enforce_page_validation)
        return true;

    if (coursesOptions.length < 4) {
        goNextError = "Se requiere de al menos cuatro clases diferentes";
        return false;
    }

    for (let course of coursesOptions) {
        if (course.editable) {
            goNextError = "Completa la edición de todas las clases antes de continuar";
            return false;
        }
    }

    return true;
}

function addCollectorListeners() {
    document.getElementById("csvSelector").onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                if (!isValidCSV(content)) {
                    setError("El archivo no cumple con el formato de exportación");
                    return;
                }

                let data = content.split("\r\n");
                for (let i = 1; i < data.length; i++)
                    if (data[i].trim().length !== 0)
                        coursesOptions.push(new Course(data[i].replaceAll(",", "\t"), false));
            };
            reader.readAsText(file);
        }
    };

    allowGoNextFunc = () => is_collected_data_valid();
}

function selectFile() {
    document.getElementById("csvSelector").click();
}

function exportData() {
    let csvString = csvHeaders + "\r\n";
    for (let course of coursesOptions)
        csvString += course.toString() + "\r\n";

    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    link.download = 'Data.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function deleteData() {
    const userSchedule = document.getElementById("userSchedule");
    for (let i = 0; i < coursesOptions.length; i++) {
        const e = document.getElementById("r" + i);
        if (e === null || e === undefined)
            continue;

        userSchedule.removeChild(e);
    }

    coursesOptions = [];
}

function stop_editing() {
    const error = document.getElementById("errorMsg");
    error.textContent = "";

    for (let i = 0; i < coursesOptions.length; i++) {
        if (!coursesOptions[i].editable)
            continue;

        const e = document.getElementById("r" + i);
        if (e === null || e === undefined)
            continue;

        e.querySelector("button").click();

        // Ugly, I know, but it works!
        if (error.textContent !== "") {
            e.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            break;
        }
    }
}

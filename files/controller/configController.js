
function timeHHMMAsNumberArray(value) {
    const time = value.split(":");
    if (time.length === 2)
        return [Number(time[0]), Number(time[1])];
    return [-1, -1];
}

function getHourIntervalPart(h, startTime) {
    return h.split("-")[startTime ? 0 : 1];
}

class ConfigController {
    // #schedulesToGenerate = 3;
    #schedulesToGenerate = 3;
    #coursesPerSchedule = 5;
    #gapBetweenClasses = "01:30";
    #preferAllDayEmptySchedules = -1;
    #combinationsPerPopulation = 2000;
    #generationsToFindMinima = 15;
    #validSchedulesToGenerate = true;
    #validCoursesPerSchedule = true;
    #validGapBetweenClasses = true;
    #validPreferAllDayEmptySchedules = true;
    #validCombinationsPerPopulation = true;
    #validGenerationsToFindMinima = true;

    getSchedulesToGenerate() {
        return Number(this.#schedulesToGenerate);
    }

    setSchedulesToGenerate(value) {
        this.#schedulesToGenerate = value;
        this.#validSchedulesToGenerate = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validSchedulesToGenerate)
            this.#validSchedulesToGenerate = ["1", "3", "5", "10"].indexOf(value) !== -1;
    }

    getCoursesPerSchedule() {
        return Number(this.#coursesPerSchedule);
    }

    setCoursesPerSchedule(value) {
        this.#coursesPerSchedule = value;
        this.#validCoursesPerSchedule = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validCoursesPerSchedule)
            this.#validCoursesPerSchedule = Number(value) > 2 && Number(value) < 13;
    }

    getGapBetweenClasses() {
        return this.#gapBetweenClasses;
    }

    setGapBetweenClasses(value) {
        this.#gapBetweenClasses = value;
        this.#validGapBetweenClasses = typeof value === "string" && /^\d{1,2}:\d{2}$/g.test(value);
        if (this.#validGapBetweenClasses) {
            const [hour, minute] = timeHHMMAsNumberArray(value);
            this.#validGapBetweenClasses = hour === 0 && minute > 0 || hour > 0 && hour < 6 && minute < 60 || hour === 6 && minute === 0;
        }
    }

    getPreferAllDayEmptySchedules() {
        return Number(this.#preferAllDayEmptySchedules);
    }

    setPreferAllDayEmptySchedules(value) {
        this.#preferAllDayEmptySchedules = value;
        this.#validPreferAllDayEmptySchedules = typeof value === "string" && /^-?\d+$/g.test(value);
        if (this.#validPreferAllDayEmptySchedules)
            this.#validPreferAllDayEmptySchedules = ["-1", "0", "1"].indexOf(value) !== -1;
    }

    getCombinationsPerPopulation() {
        return Number(this.#combinationsPerPopulation);
    }

    setCombinationsPerPopulation(value) {
        this.#combinationsPerPopulation = value;
        this.#validCombinationsPerPopulation = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validCombinationsPerPopulation)
            this.#validCombinationsPerPopulation = Number(value) > 499 && Number(value) < 100001;
    }

    getGenerationsToFindMinima() {
        return Number(this.#generationsToFindMinima);
    }

    setGenerationsToFindMinima(value) {
        this.#generationsToFindMinima = value;
        this.#validGenerationsToFindMinima = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validGenerationsToFindMinima)
            this.#validGenerationsToFindMinima = Number(value) > 4 && Number(value) < 1001;
    }

    isValid() {
        if (!this.#validSchedulesToGenerate)
            return "La cantidad de horarios a generar es inválida o está fuera del rango [1, 3, 5, 10]";
        if (!this.#validCoursesPerSchedule)
            return "La cantidad de materias por horario es inválida o está fuera del rango [3, 12]";
        if (!this.#validGapBetweenClasses)
            return "El tiempo indicado no cumple el formato HH:MM o está fuera del rango [00:01, 06:00]";
        if (!this.#validPreferAllDayEmptySchedules)
            return "El valor de preferencia para días vacíos no es válido o no pertenece al conjunto [-1, 0, 1]";
        if (!this.#validCombinationsPerPopulation)
            return "La cantidad de individuos por población es inválida o está fuera del rango [500, 100000]";
        if (!this.#validGenerationsToFindMinima)
            return "La cantidad de poblaciones para encontrar el mínimo es inválida o está fuera del rango [5, 1000]";

        return "";
    }
}

const configController = new ConfigController();

function toggle_option(options, option, id) {
    options.forEach((e) => {
        const element = document.getElementById(id + e);
        if (e === option) {
            element.classList.add("bg-ipn-0", "text-white");
            element.classList.remove("bg-sidebar-0", "dark:bg-sidebar-1");
            return;
        }

        element.classList.remove("bg-ipn-0", "text-white");
        element.classList.add("bg-sidebar-0", "dark:bg-sidebar-1");
    });
}

function set_schedules_to_generate(amount) {
    toggle_option(["1", "3", "5", "10"], amount, "schedule-amount-selector-");
    configController.setSchedulesToGenerate(amount);
}

function set_preference_for_empty_days(value) {
    toggle_option(["-1", "0", "1"], value, "empty-day-selector-");
    configController.setPreferAllDayEmptySchedules(value);
}

let isDragging = false;
let currentOver = null;

function set_courses_per_schedule(value) {
    configController.setCoursesPerSchedule(value);
    value = configController.getCoursesPerSchedule();
    for (let i = 1; i < 13; i++) {
        const element = document.getElementById("course-amount-" + i);
        if (i > value) {
            element.classList.add("border");
            element.classList.remove("bg-ipn-0");
            continue;
        }

        element.classList.remove("border");
        element.classList.add("bg-ipn-0");
    }

    document.getElementById("coursesPerSchedule").textContent = `${value} materias`;
}

function set_gap_between_classes() {
    const hours_element = document.getElementById("hour-input");
    const minute_element = document.getElementById("minute-input");
    configController.setGapBetweenClasses(hours_element.value + ":" + minute_element.value);
}

function addConfigFieldsListeners() {
    /*document.getElementById("coursesPerSchedule").addEventListener("keyup", (e) => {
        configController.setCoursesPerSchedule(e.target.value);
    });*/



    const container = document.getElementById("course-amount-selector");
    const buttons = Array.from(container.querySelectorAll('button'));

    container.addEventListener('pointerdown', e => {
        isDragging = true;
        e.preventDefault();
    });

    container.addEventListener('pointermove', e => {
        if (!isDragging)
            return;

        const under = document.elementFromPoint(e.clientX, e.clientY);
        const btn = buttons.find(b => b === under || b.contains(under));

        if (btn !== currentOver) {
            currentOver = btn;
            if (currentOver)
                currentOver.click();
        }
    });

    container.addEventListener('pointerup', e => {
        if (!isDragging)
            return;
        isDragging = false;
        currentOver = null;
    });

    container.addEventListener('pointercancel', () => {
        isDragging = false;
        if (currentOver)
            currentOver = null;
    });

    document.getElementById("hour-input").addEventListener("keyup", (e) => {
        set_gap_between_classes();
    });

    document.getElementById("minute-input").addEventListener("keyup", (e) => {
        set_gap_between_classes();
    });

    document.getElementById("combinationsPerPopulation").addEventListener("keyup", (e) => {
        configController.setCombinationsPerPopulation(e.target.value);
    });

    document.getElementById("generations").addEventListener("keyup", (e) => {
        configController.setGenerationsToFindMinima(e.target.value);
    });
}

function is_config_data_valid() {
    if (!enforce_page_validation)
        return true;

    goNextError = configController.isValid();
    return goNextError === "";
}

function reloadConfigData() {
    set_schedules_to_generate("" + configController.getSchedulesToGenerate());

    set_courses_per_schedule("" + configController.getCoursesPerSchedule());

    const [hours, minutes] = configController.getGapBetweenClasses().split(":");
    document.getElementById("hour-input").value = hours;
    document.getElementById("minute-input").value = minutes;

    set_preference_for_empty_days("" + configController.getPreferAllDayEmptySchedules());

    document.getElementById("combinationsPerPopulation").value = configController.getCombinationsPerPopulation();
    document.getElementById("generations").value = configController.getGenerationsToFindMinima();

    allowGoNextFunc = () => is_config_data_valid();
}

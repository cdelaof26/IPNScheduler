
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
    #schedulesToGenerate = 1;
    #coursesPerSchedule = 5;
    #gapBetweenClasses = "01:30";
    #preferAllDayEmptySchedules = -1;
    #combinationsPerPopulation = 2000;
    #generationsToFindMinima = 30;
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
        this.#validGapBetweenClasses = typeof value === "string" && /^\d{1,2}:\d{1,2}$/g.test(value);
        if (this.#validGapBetweenClasses) {
            const [hour, minute] = timeHHMMAsNumberArray(value);
            this.#validGapBetweenClasses = hour === 0 && minute > 0 || hour > 0 && hour < 4 && minute < 60;
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
            this.#validCombinationsPerPopulation = Number(value) > 999 && Number(value) < 10001;
    }

    getGenerationsToFindMinima() {
        return Number(this.#generationsToFindMinima);
    }

    setGenerationsToFindMinima(value) {
        this.#generationsToFindMinima = value;
        this.#validGenerationsToFindMinima = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validGenerationsToFindMinima)
            this.#validGenerationsToFindMinima = Number(value) > 9 && Number(value) < 1001;
    }

    isValid() {
        if (!this.#validSchedulesToGenerate)
            return "La cantidad de horarios a generar es inválida o está fuera del rango [1, 3, 5, 10]";
        if (!this.#validCoursesPerSchedule)
            return "La cantidad de materias por horario es inválida o está fuera del rango [3, 12]";
        if (!this.#validGapBetweenClasses)
            return "El tiempo indicado no cumple el formato HH:MM o está fuera del rango [00:01, 03:59]";
        if (!this.#validPreferAllDayEmptySchedules)
            return "El valor de preferencia para días vacíos no es válido o no pertenece al conjunto [-1, 0, 1]";
        if (!this.#validCombinationsPerPopulation)
            return "La cantidad de individuos por población es inválida o está fuera del rango [1000, 10000]";
        if (!this.#validGenerationsToFindMinima)
            return "La cantidad de poblaciones para encontrar el mínimo es inválida o está fuera del rango [10, 1000]";

        return "";
    }
}

const configController = new ConfigController();

function addConfigFieldsListeners() {
    document.getElementById("schedulesAmount").addEventListener("change", (e) => {
        configController.setSchedulesToGenerate(e.target.value);
    });

    document.getElementById("coursesPerSchedule").addEventListener("keyup", (e) => {
        configController.setCoursesPerSchedule(e.target.value);
    });

    document.getElementById("gapBetweenClasses").addEventListener("keyup", (e) => {
        configController.setGapBetweenClasses(e.target.value);
    });

    document.getElementById("preferAllDayEmptySchedules").addEventListener("change", (e) => {
        configController.setPreferAllDayEmptySchedules(e.target.value);
    });

    document.getElementById("combinationsPerPopulation").addEventListener("keyup", (e) => {
        configController.setCombinationsPerPopulation(e.target.value);
    });

    document.getElementById("generations").addEventListener("keyup", (e) => {
        configController.setGenerationsToFindMinima(e.target.value);
    });
}

function reloadConfigData() {
    document.getElementById("schedulesAmount").value = configController.getSchedulesToGenerate();
    document.getElementById("coursesPerSchedule").value = configController.getCoursesPerSchedule();
    document.getElementById("gapBetweenClasses").value = configController.getGapBetweenClasses();
    document.getElementById("preferAllDayEmptySchedules").value = configController.getPreferAllDayEmptySchedules();
    document.getElementById("combinationsPerPopulation").value = configController.getCombinationsPerPopulation();
    document.getElementById("generations").value = configController.getGenerationsToFindMinima();

    allowGoNextFunc = () => {
        goNextError = configController.isValid();
        return goNextError === "";
    };
}

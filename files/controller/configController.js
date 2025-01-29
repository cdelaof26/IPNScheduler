
class ConfigController {
    #schedulesToGenerate = 3;
    #coursesPerSchedule = 5;
    #combinationsPerPopulation = 2000;
    #generationsToFindMinima = 30;
    #validSchedulesToGenerate = true;
    #validCoursesPerSchedule = true;
    #validCombinationsPerPopulation = true;
    #validGenerationsToFindMinima = true;

    getSchedulesToGenerate() {
        return this.#schedulesToGenerate;
    }

    setSchedulesToGenerate(value) {
        this.#schedulesToGenerate = value;
        this.#validSchedulesToGenerate = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validSchedulesToGenerate)
            this.#validSchedulesToGenerate = ["1", "3", "5", "10"].indexOf(value) !== -1;
    }

    getCoursesPerSchedule() {
        return this.#coursesPerSchedule;
    }

    setCoursesPerSchedule(value) {
        this.#coursesPerSchedule = value;
        this.#validCoursesPerSchedule = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validCoursesPerSchedule)
            this.#validCoursesPerSchedule = Number(value) > 2 && Number(value) < 13;
    }

    getCombinationsPerPopulation() {
        return this.#combinationsPerPopulation;
    }

    setCombinationsPerPopulation(value) {
        this.#combinationsPerPopulation = value;
        this.#validCombinationsPerPopulation = typeof value === "string" && /^\d+$/g.test(value);
        if (this.#validCombinationsPerPopulation)
            this.#validCombinationsPerPopulation = Number(value) > 999 && Number(value) < 10001;
    }

    getGenerationsToFindMinima() {
        return this.#generationsToFindMinima;
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
        if (!this.#validCombinationsPerPopulation)
            return "La cantidad de individuos por población es inválida o está fuera del rango [1000, 10000]";
        if (this.#validGenerationsToFindMinima)
            return "La cantidad de poblaciones para encontrar el mínimo es inválida o está fuera del rango [10, 1000]";

        return "";
    }
}

const controller = new ConfigController();

function addConfigFieldsListeners() {
    document.getElementById("schedulesAmount").addEventListener("change", (e) => {
        controller.setSchedulesToGenerate(e.target.value);
    });

    document.getElementById("coursesPerSchedule").addEventListener("keyup", (e) => {
        controller.setCoursesPerSchedule(e.target.value);
    });

    document.getElementById("combinationsPerPopulation").addEventListener("keyup", (e) => {
        controller.setCombinationsPerPopulation(e.target.value);
    });

    document.getElementById("generations").addEventListener("keyup", (e) => {
        controller.setGenerationsToFindMinima(e.target.value);
    });
}

function reloadConfigData() {
    document.getElementById("schedulesAmount").value = controller.getSchedulesToGenerate();
    document.getElementById("coursesPerSchedule").value = controller.getCoursesPerSchedule();
    document.getElementById("combinationsPerPopulation").value = controller.getCombinationsPerPopulation();
    document.getElementById("generations").value = controller.getGenerationsToFindMinima();

    allowGoNextFunc = () => {
        goNextError = controller.isValid();
        return goNextError === "";
    };
}

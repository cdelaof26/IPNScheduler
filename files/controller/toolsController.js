
const horarioCSVHeaders = "Grupo,Asignatura,Profesor,Edificio,Salón,Lun,Mar,Mie,Jue,Vie,Sab";
const disponibilidadCSVHeaders = "Grupo,Materia,Nombre de la Materia,Semestre,Cupo,Inscritos,Disponibles";

let loadedAvailabilityCSV = false;
let possibleCourses = [];

function isValidHorarioCSV(data) {
    return validCSV(data) && data.split("\r\n")[0] === horarioCSVHeaders;
}

function isValidDisponibilidadCSV(data) {
    return validCSV(data) && data.split("\r\n")[0] === disponibilidadCSVHeaders;
}

function addToolsListeners() {
    document.getElementById("csvSelector").onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                let isHorario = isValidHorarioCSV(content);

                if (!isHorario && !isValidDisponibilidadCSV(content)) {
                    setError("El archivo no cumple con el formato de exportación");
                    return;
                }

                let data = content.split("\r\n");
                if (isHorario) {
                    loadAsPossibleCourse = true;
                    for (let i = 1; i < data.length; i++)
                        if (data[i].trim().length !== 0)
                            possibleCourses.push(new Course(data[i].replaceAll(",", "\t"), false));

                    loadAsPossibleCourse = false;
                    return;
                }

                if (possibleCourses.length === 0) {
                    setError("Debes importar los horarios primero");
                    return;
                }

                loadedAvailabilityCSV = true;

                for (let i = 1; i < data.length; i++)
                    if (data[i].trim().length !== 0) {
                        let course = data[i].split(",");
                        for (let c of possibleCourses)
                            if (c.getGroup() === course[0] && c.getName() === course[2]) {
                                c.available = course[6] !== "0";
                                break;
                            }
                    }
            };
            reader.readAsText(file);
        }
    };

    document.getElementById("showUnavailable").onchange = (event) => {
        if (!loadedAvailabilityCSV)
            setError("Debes cargar el archivo de Disponibilidad.csv que obtienes con el Script Ocupabilidad Horario");
        showUnavailable = event.target.value === "true";
        reloadToolsData();
    };
}

function reloadToolsData() {
    loadAsPossibleCourse = true;
    reloadAllCollectedData();
    loadAsPossibleCourse = false;
}

function deleteToolsData() {
    loadedAvailabilityCSV = false;
    loadAsPossibleCourse = true;
    deleteData();
    loadAsPossibleCourse = false;
}

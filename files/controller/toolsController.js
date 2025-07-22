
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
    const csv_selector = document.getElementById("csvSelector");
    csv_selector.onchange = (event) => {
        const file = event.target.files[0];
        csv_selector.value = "";
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
                console.log(data)
                if (isHorario) {
                    loadAsPossibleCourse = true;
                    for (let i = 1; i < data.length; i++)
                        if (data[i].trim().length !== 0) {
                            let c = new Course(data[i].replaceAll(",", "\t"), false);
                            let append = true;
                            for (let c1 of possibleCourses)
                                if (c.equals(c1)) {
                                    append = false;
                                    break;
                                }

                            if (append)
                                possibleCourses.push(c);
                        }

                    reloadAllCollectedData();
                    loadAsPossibleCourse = false;
                    return;
                }

                if (possibleCourses.length === 0) {
                    setError("Debes importar los horarios primero");
                    return;
                }

                loadedAvailabilityCSV = true;
                toggleErrorNotificationVisibility(true);

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
        if (!loadedAvailabilityCSV) {
            setError("Debes cargar el archivo de Disponibilidad.csv que obtienes con el Script Ocupabilidad Horario");
            document.getElementById("showUnavailable").value = "true";
            return;
        }

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
    const userSchedule = document.getElementById("userSchedule");
    for (let i = 0; i < possibleCourses.length; i++) {
        const e = document.getElementById("r" + i);
        if (e !== null && e !== undefined)
            userSchedule.removeChild(e);

        for (let j = 0; j < coursesOptions.length; j++)
            if (possibleCourses[i].equals(coursesOptions[j])) {
                coursesOptions.splice(j, 1);
                break;
            }
    }

    possibleCourses = [];
}

function selectAll() {
    for (let i = 0; i < possibleCourses.length; i++) {
        if (!showUnavailable && !possibleCourses[i].available)
            continue;

        if (!possibleCourses[i].selected)
            document.getElementById('r' + i + 'btn').click();
    }
}

function filter_out(evt) {
    const text = evt.target.value.toLowerCase();

    for (let i = 0; i < possibleCourses.length; i++) {
        if (text === "") {
            possibleCourses[i].show = true;
            continue;
        }

        const group = possibleCourses[i].getGroup().toLowerCase();
        const name = possibleCourses[i].getName().toLowerCase();
        const teacher = possibleCourses[i].getTeacher().toLowerCase();
        possibleCourses[i].show = group.includes(text) || name.includes(text) || teacher.includes(text);
    }

    reloadToolsData();
}

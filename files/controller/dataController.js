
const preferences = ['Si o si debe estar', 'Fuertemente preferido', 'Moderadamente preferido', 'Moderadamente evitar', 'Preferentemente evitar', 'Sin preferencia'];
const preferencesValues = [-1, 0, 1, 2, 3, 4];

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

    constructor(data) {
        if (data === null || data === undefined)
            return;

        if (!this.#setSAESCopyPastedData(data))
            return;

        this.editable = false;
        const split = data.split("\t");
        if ((split.length - 1) === 8) {
            const preferenceValue = Number(split[8]);
            if (/^-?\d$/g.test(preferenceValue))
                this.setPreference(preferences[preferencesValues.indexOf(preferenceValue)]);
        }
    }

    #setSAESCopyPastedData(data) {
        if (typeof data !== "string")
            return false;

        if (!data.includes("\t"))
            return false;

        const splited = data.split("\t");
        if (splited.length > 3 && /^\d+$/g.test(splited[3]))
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

        this.#hours[id] = hour.trim();
        this.#validHours[id] = this.#hours[id].length === 0;
        if (this.#validHours[id] || !/^\d{1,2}:\d{1,2}-\d{1,2}:\d{1,2}$/g.test(hour))
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
            return "Grupo, nombre o profesor inválido";

        if (this.#group.trim().length === 0 || this.#name.trim().length === 0 || this.#teacher.trim().length === 0)
            return "Grupo, nombre o profesor vacío";

        let allEmpty = true;
        for (let i = 0; i < this.#hours.length; i++) {
            if (!this.#validHours[i])
                return `Intervalo de hora inválido: '${this.#hours[i]}'`;

            allEmpty = allEmpty && this.#hours[i].trim().length === 0;
        }

        if (allEmpty)
            return "Debe haber al menos una hora definida a la semana";

        if (!this.#validPreference)
            return "Preferencia inválida";

        return "";
    }
}

let coursesOptions = [];

function reloadAllCollectedData() {
    // Not the most efficient way to update a row, but you gotta take in account that this a 3-day project
    const userSchedule = document.getElementById("userSchedule");
    if (userSchedule === null || userSchedule === undefined)
        return;

    for (let i = 0; i < coursesOptions.length; i++) {
        const e = document.getElementById("r" + i);
        if (e === null || e === undefined)
            continue;

        userSchedule.removeChild(e);
    }
    userSchedule.removeChild(document.getElementById("newRowButton"));

    for (let i = 0; i < coursesOptions.length; i++) {
        userSchedule.appendChild(coursesOptions[i].editable ? newEditableRow(i) : newNonEditableRow(i));
        reloadTableIcon();
    }
    userSchedule.appendChild(createAddRowButton());
}

function createOption(text) {
    const option = document.createElement('option');
    option.textContent = text;
    option.setAttribute('value', text);
    return option;
}

function preferenceSelector(index) {
    const select = document.createElement('select');
    select.className = 'appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ipn-0 focus:border-ipn-0 block w-full p-2.5 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';

    const option = document.createElement('option');
    option.textContent = coursesOptions[index].hasValidPreference() ? coursesOptions[index].getPreference() : 'Seleccionar...';
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    select.appendChild(option);

    select.onchange = (event) => coursesOptions[index].setPreference(event.target.value);
    for (let preference of preferences)
        select.appendChild(createOption(preference));

    return select;
}

function createAddRowButton() {
    const tr = document.createElement('tr');
    tr.setAttribute('id', 'newRowButton');
    tr.appendChild(document.createElement('td'));

    const td = document.createElement('td');

    const button = document.createElement('button');
    button.className = 'my-2 p-3 rounded-xl bg-ipn-0 text-white';
    button.onclick = function() {createNewRow()};
    button.textContent = 'Agregar materia';
    td.appendChild(button);
    tr.appendChild(td);

    return tr;
}

function createHourInput(dayIndex, index) {
    let td = document.createElement('td');
    td.className = 'p-1 h-full self-center';

    const label = document.createElement('label');
    label.className = 'flex';
    const input = document.createElement('textarea');
    input.value = coursesOptions[index].getHour(dayIndex) === "-" ? "" : coursesOptions[index].getHour(dayIndex);
    input.onkeyup = (event) => coursesOptions[index].setHour(dayIndex, event.target.value);
    input.className = 'self-center text-center h-[60%] resize-none bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';
    input.setAttribute('placeholder', 'NA');
    label.appendChild(input);

    td.appendChild(label);
    return td;
}

function newTD(side, text, centerText) {
    // side: 0 (left), 1 (middle), 2 (right)
    let td = document.createElement('td');
    td.className = 'p-4 ' + (centerText ? "text-center " : "") + (side === 0 ? "rounded-l-xl" : side === 1 ? "" : "rounded-r-xl");
    td.innerText = text;
    return td;
}

function newActionButtons(index) {
    let td = document.createElement('td');
    td.className = 'rounded-r-xl pr-4 py-4';

    let div = document.createElement('div');
    div.className = 'flex justify-center space-x-2';
    td.appendChild(div);

    let button = document.createElement('button');
    button.className = 'self-center rounded-lg ' + (coursesOptions[index].editable ? 'bg-ipn-0 text-white p-1' : '');

    let i = document.createElement('i');
    i.className = 'w-5';
    i.setAttribute('id', 'edit');
    button.appendChild(i);
    button.onclick = () => {
        const actualRow = document.getElementById("r" + index);

        if (coursesOptions[index].editable) {
            const validData = coursesOptions[index].isValid();
            if (validData !== "") {
                setError(validData);
                return;
            }
        }

        actualRow.replaceWith(coursesOptions[index].editable ? newNonEditableRow(index) : newEditableRow(index));
        reloadTableIcon();
    }
    div.appendChild(button);

    let button2 = document.createElement('button');
    button2.className = 'self-center';
    button2.onclick = () => {
        const userSchedule = document.getElementById("userSchedule");
        if (userSchedule === null || userSchedule === undefined)
            return;

        for (let i = 0; i < coursesOptions.length; i++)
            userSchedule.removeChild(document.getElementById("r" + i));
        userSchedule.removeChild(document.getElementById("newRowButton"));

        coursesOptions.splice(index, 1);
        for (let i = 0; i < coursesOptions.length; i++) {
            userSchedule.appendChild(coursesOptions[i].editable ? newEditableRow(i) : newNonEditableRow(i));
            reloadTableIcon();
        }
        userSchedule.appendChild(createAddRowButton());
    }

    let i2 = document.createElement('i');
    i2.className = 'w-5';
    i2.setAttribute('id', 'delete');
    button2.appendChild(i2);
    div.appendChild(button2);

    return td;
}

function newNonEditableRow(index) {
    if (index > coursesOptions.length)
        return;

    coursesOptions[index].editable = false;

    let tr = document.createElement('tr');
    tr.setAttribute("id", "r" + index);
    tr.className = 'bg-body-0 dark:bg-body-1';

    tr.appendChild(newTD(0, coursesOptions[index].getGroup(), true));
    tr.appendChild(newTD(1, coursesOptions[index].getName(), false));
    tr.appendChild(newTD(1, coursesOptions[index].getTeacher(), false));

    for (let i = 0; i < 5; i++)
        tr.appendChild(newTD(1, coursesOptions[index].getHour(i), true));

    tr.appendChild(newTD(1, coursesOptions[index].getPreference(), true));
    tr.appendChild(newActionButtons(index));

    return tr;
}

function newEditableRow(index) {
    if (index > coursesOptions.length)
        return;

    coursesOptions[index].editable = true;

    let tr = document.createElement('tr');
    tr.setAttribute("id", "r" + index);
    tr.className = 'bg-body-0 dark:bg-body-1';

    let td1 = document.createElement('td');
    td1.className = 'rounded-l-xl p-4';

    let label = document.createElement('label');

    let input1 = document.createElement('input');
    input1.className = 'text-center bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';
    input1.setAttribute('placeholder', 'Grupo');
    input1.value = coursesOptions[index].getGroup();
    input1.onkeyup = (event) => coursesOptions[index].setGroup(event.target.value);
    label.appendChild(input1);
    td1.appendChild(label);
    tr.appendChild(td1);

    let td2 = document.createElement('td');
    td2.className = 'p-4';

    let label2 = document.createElement('label');
    label2.className = 'flex';

    let input3 = document.createElement('textarea');
    input3.className = 'self-center resize-none bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';
    input3.setAttribute('placeholder', 'Nombre');
    input3.value = coursesOptions[index].getName();
    input3.onkeyup = (event) => coursesOptions[index].setName(event.target.value);
    label2.appendChild(input3);
    td2.appendChild(label2);
    tr.appendChild(td2);

    let td3 = document.createElement('td');
    td3.className = 'p-4';

    let label3 = document.createElement('label');
    label3.className = 'flex';

    let input4 = document.createElement('textarea');
    input4.className = 'self-center resize-none bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';
    input4.setAttribute('placeholder', 'Profesor');
    input4.value = coursesOptions[index].getTeacher();
    input4.onkeyup = (event) => coursesOptions[index].setTeacher(event.target.value);
    label3.appendChild(input4);
    td3.appendChild(label3);
    tr.appendChild(td3);

    tr.appendChild(createHourInput(0, index));
    tr.appendChild(createHourInput(1, index));
    tr.appendChild(createHourInput(2, index));
    tr.appendChild(createHourInput(3, index));
    tr.appendChild(createHourInput(4, index));

    let td9 = document.createElement('td');
    td9.className = 'p-4';
    td9.appendChild(preferenceSelector(index));
    tr.appendChild(td9);

    tr.appendChild(newActionButtons(index));

    return tr;
}

function createNewRow() {
    const userSchedule = document.getElementById("userSchedule");
    if (userSchedule === null || userSchedule === undefined)
        return;

    const index = coursesOptions.length;
    coursesOptions.push(new Course());

    userSchedule.removeChild(document.getElementById("newRowButton"));
    userSchedule.appendChild(newEditableRow(index));
    userSchedule.appendChild(createAddRowButton());
    loadIcons();
}

function isValidCSV(data) {
    if (data.length === 0 || !data.includes("\n"))
        return false;

    return data.split("\r\n")[0] === "Grupo,Materia,Profesor,Lunes,Martes,Miércoles,Jueves,Viernes,Preferencia";
}

function addCollectorListeners() {
    document.getElementById("csvSelector").onchange = (e) => {
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
                    coursesOptions.push(new Course(data[i].replaceAll(",", "\t")));
            };
            reader.readAsText(file);
        }
    };

    allowGoNextFunc = () => {
        if (coursesOptions.length < 4) {
            goNextError = "Se requiere de al menos una tres clases diferentes";
            return false;
        }

        for (let course of coursesOptions) {
            if (course.editable) {
                goNextError = "Para continuar termina de editar todas las clases";
                return false;
            }
        }

        return true;
    };
}

function selectFile() {
    document.getElementById("csvSelector").click();
}

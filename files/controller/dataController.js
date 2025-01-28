

function newRow() {
    let tbody = document.createElement("tbody");

    let tr = document.createElement('tr');
    tr.className = 'bg-body-0 dark:bg-body-1';

    let td1 = document.createElement('td');
    td1.className = 'rounded-l-xl p-4';

    let label = document.createElement('label');

    let input = document.createElement('input');
    input.className = 'text-center bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';
    input.setAttribute('placeholder', 'Grupo');
    label.appendChild(input);
    td1.appendChild(label);
    tr.appendChild(td1);

    let td2 = document.createElement('td');
    td2.className = 'p-4';

    let label2 = document.createElement('label');

    let input3 = document.createElement('input');
    input3.className = 'bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';
    input3.setAttribute('placeholder', 'Nombre');
    label2.appendChild(input3);
    td2.appendChild(label2);
    tr.appendChild(td2);

    let td3 = document.createElement('td');
    td3.className = 'p-4';

    let label3 = document.createElement('label');

    let input4 = document.createElement('input');
    input4.className = 'bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';
    input4.setAttribute('placeholder', 'Profesor');
    label3.appendChild(input4);
    td3.appendChild(label3);
    tr.appendChild(td3);

    let td4 = document.createElement('td');
    td4.className = 'p-4';
    td4.textContent = '                            Grupo';
    tr.appendChild(td4);

    let td5 = document.createElement('td');
    td5.className = 'p-4';
    td5.textContent = '                            Grupo';
    tr.appendChild(td5);

    let td6 = document.createElement('td');
    td6.className = 'p-4';
    td6.textContent = '                            Grupo';
    tr.appendChild(td6);

    let td7 = document.createElement('td');
    td7.className = 'p-4';
    td7.textContent = '                            Grupo';
    tr.appendChild(td7);

    let td8 = document.createElement('td');
    td8.className = 'p-4';
    td8.textContent = '                            Grupo';
    tr.appendChild(td8);

    let td9 = document.createElement('td');
    td9.className = 'p-4';
    td9.textContent = '                            Grupo';
    tr.appendChild(td9);

    let td10 = document.createElement('td');
    td10.className = 'space-x-2 rounded-r-xl p-4';

    let button = document.createElement('button');

    let i = document.createElement('i');
    i.className = 'w-5';
    i.setAttribute('id', 'edit');
    button.appendChild(i);
    td10.appendChild(button);

    let button2 = document.createElement('button');

    let i2 = document.createElement('i');
    i2.className = 'w-5';
    i2.setAttribute('id', 'delete');
    button2.appendChild(i2);
    td10.appendChild(button2);
    tr.appendChild(td10);
    tbody.appendChild(tr);
}


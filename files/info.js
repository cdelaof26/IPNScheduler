function info() {

    let div = document.createElement('div');
    div.className = 'flex flex-col justify-between w-full h-full p-12 rounded-2xl shadow-2xl bg-body-0 dark:bg-body-1';

    let div0 = document.createElement('div');

    let p = document.createElement('p');
    p.className = 'text-3xl font-bold';
    p.textContent = '¡Bienvenid@!';
    div0.appendChild(p);

    let p1 = document.createElement('p');
    p1.className = 'mt-4 text-lg';
    p1.textContent = 'Esta herramienta tiene como objetivo ayudar a los estudiantes del IPN a crear horarios de forma rápida y sencilla, teniendo en cuenta la preferencia por una determinada unidad de aprendizaje y evitando las horas muertas entre clases.';
    div0.appendChild(p1);
    div.appendChild(div0);

    let div2 = document.createElement('div');
    div2.className = 'flex justify-center space-x-8 mt-4';

    let button = document.createElement('button');
    button.className = 'flex flex-col justify-center w-56 h-56 rounded-xl bg-ipn-0 text-white';

    let i = document.createElement('i');
    i.className = 'self-center h-20 w-20';
    i.setAttribute('id', 'generateButton');
    button.appendChild(i);

    let span = document.createElement('span');
    span.className = 'self-center font-bold mt-6 text-lg';
    span.textContent = 'Generar horario';
    button.appendChild(span);
    div2.appendChild(button);

    let button3 = document.createElement('button');
    button3.className = 'flex flex-col justify-center w-56 h-56 rounded-xl bg-ipn-0 text-white';

    let i4 = document.createElement('i');
    i4.className = 'self-center h-20 w-20';
    i4.setAttribute('id', 'howWorksButton');
    button3.appendChild(i4);

    let span5 = document.createElement('span');
    span5.className = 'self-center font-bold mt-6 text-lg';
    span5.textContent = '¿Como funciona?';
    button3.appendChild(span5);
    div2.appendChild(button3);

    let button6 = document.createElement('button');
    button6.className = 'flex flex-col justify-center w-56 h-56 rounded-xl bg-ipn-0 text-white';

    let i7 = document.createElement('i');
    i7.className = 'self-center h-20 w-20';
    i7.setAttribute('id', 'helpButton');
    button6.appendChild(i7);

    let span8 = document.createElement('span');
    span8.className = 'self-center font-bold mt-6 text-lg';
    span8.textContent = 'Sección de ayuda';
    button6.appendChild(span8);
    div2.appendChild(button6);

    let button9 = document.createElement('button');
    button9.className = 'flex flex-col justify-center w-56 h-56 rounded-xl bg-ipn-0 text-white';

    let i10 = document.createElement('i');
    i10.className = 'self-center h-20 w-20';
    i10.setAttribute('id', 'creditsButton');
    button9.appendChild(i10);

    let span11 = document.createElement('span');
    span11.className = 'self-center font-bold mt-6 text-lg';
    span11.textContent = 'Créditos';
    button9.appendChild(span11);
    div2.appendChild(button9);
    div.appendChild(div2);

    let div12 = document.createElement('div');
    div12.className = 'flex justify-between';

    let button13 = document.createElement('button');

    let i14 = document.createElement('i');
    i14.className = 'h-16';
    i14.setAttribute('id', 'previous');
    button13.appendChild(i14);
    div12.appendChild(button13);

    let div15 = document.createElement('div');
    div15.className = 'flex flex-col justify-center';

    let p16 = document.createElement('p');
    p16.className = 'self-center';
    p16.textContent = 'Title';
    div15.appendChild(p16);

    let p17 = document.createElement('p');
    p17.className = 'self-center';
    p17.textContent = '0/3';
    div15.appendChild(p17);
    div12.appendChild(div15);

    let button18 = document.createElement('button');

    let i19 = document.createElement('i');
    i19.className = 'h-16';
    i19.setAttribute('id', 'next');
    button18.appendChild(i19);
    div12.appendChild(button18);
    div.appendChild(div12);
    div.id = 'data_container';
    document.getElementById('data_container').replaceWith(div);
}
document.addEventListener('DOMContentLoaded', function() {
    let root_script = document.querySelector('script#nav');

    let nav = document.createElement('nav');
    nav.className = 'h-[10%] w-full p-6';

    let div = document.createElement('div');
    div.className = 'flex space-x-8';

    let a = document.createElement('a');
    a.className = 'self-center';
    a.setAttribute('href', 'https://github.com/cdelaof26/');
    a.setAttribute('target', '_blank');

    let i = document.createElement('i');
    i.className = 'h-8';
    i.setAttribute('id', 'githubIcon');
    a.appendChild(i);
    div.appendChild(a);

    let button = document.createElement('button');
    button.className = 'p-1 text-lg border-t-4 border-ipn-0';
    button.textContent = 'Generar';
    div.appendChild(button);

    let button0 = document.createElement('button');
    button0.className = 'p-1 text-lg border-t-4 border-transparent';
    button0.textContent = 'Funcionamiento';
    div.appendChild(button0);

    let button1 = document.createElement('button');
    button1.className = 'p-1 text-lg border-t-4 border-transparent';
    button1.textContent = 'Ayuda';
    div.appendChild(button1);
    nav.appendChild(div);
    root_script.replaceWith(nav);
    nav.id = 'nav'
})
function info() {let div = document.createElement('div');div.className = 'flex flex-col justify-between w-full h-full p-6 lg:p-12 rounded-2xl shadow-2xl bg-body-0 dark:bg-body-1';let div0 = document.createElement('div');let p = document.createElement('p');p.className = 'text-2xl lg:text-3xl font-bold';p.textContent = '¡Bienvenid@!';div0.appendChild(p);let p1 = document.createElement('p');p1.className = 'mt-4 text-lg';p1.textContent = 'Esta herramienta tiene como objetivo ayudar a los estudiantes del IPN a crear horarios de forma rápida y sencilla, teniendo en cuenta la preferencia por una determinada unidad de aprendizaje y evitando las horas muertas entre clases.';div0.appendChild(p1);div.appendChild(div0);let div2 = document.createElement('div');div2.className = 'flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 lg:space-x-8 mt-4';let button = document.createElement('button');button.className = 'flex md:flex-col justify-center w-full h-12 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl bg-ipn-0 text-white';button.onclick = function() {loadPage("dataCollector")};let i = document.createElement('i');i.className = 'self-center h-8 md:h-16 lg:h-20';i.setAttribute('id', 'generateButton');button.appendChild(i);let span = document.createElement('span');span.className = 'self-center font-bold ps-3 md:ps-0 md:mt-3 lg:mt-6 lg:text-lg';span.textContent = 'Generar horario';button.appendChild(span);div2.appendChild(button);let button3 = document.createElement('button');button3.className = 'flex md:flex-col justify-center w-full h-12 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl bg-ipn-0 text-white';button3.onclick = function() {loadPage("operationInfo")};let i4 = document.createElement('i');i4.className = 'self-center h-8 md:h-16 lg:h-20';i4.setAttribute('id', 'howWorksButton');button3.appendChild(i4);let span5 = document.createElement('span');span5.className = 'self-center font-bold ps-3 md:ps-0 md:mt-3 lg:mt-6 lg:text-lg';span5.textContent = '¿Como funciona?';button3.appendChild(span5);div2.appendChild(button3);let button6 = document.createElement('button');button6.className = 'flex md:flex-col justify-center w-full h-12 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl bg-ipn-0 text-white';let i7 = document.createElement('i');i7.className = 'self-center h-8 md:h-16 lg:h-20';i7.setAttribute('id', 'helpButton');button6.appendChild(i7);let span8 = document.createElement('span');span8.className = 'self-center font-bold ps-3 md:ps-0 md:mt-3 lg:mt-6 lg:text-lg';span8.textContent = 'Sección de ayuda';button6.appendChild(span8);div2.appendChild(button6);let button9 = document.createElement('button');button9.className = 'flex md:flex-col justify-center w-full h-12 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl bg-ipn-0 text-white';button9.onclick = function() {loadPage("developer")};let i10 = document.createElement('i');i10.className = 'self-center h-8 md:h-16 lg:h-20';i10.setAttribute('id', 'creditsButton');button9.appendChild(i10);let span11 = document.createElement('span');span11.className = 'self-center font-bold ps-3 md:ps-0 md:mt-3 lg:mt-6 lg:text-lg';span11.textContent = 'Créditos';button9.appendChild(span11);div2.appendChild(button9);div.appendChild(div2);let div12 = document.createElement('div');div12.setAttribute('id', 'pageButtons');div.appendChild(div12);div.id = 'data_container';document.getElementById('data_container').replaceWith(div);}
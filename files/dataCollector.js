function dataCollector() {let div = document.createElement('div');div.className = 'flex flex-col justify-between w-full h-full p-12 space-y-6 rounded-2xl shadow-2xl bg-body-0 dark:bg-body-1';let div0 = document.createElement('div');div0.className = 'h-[90%] space-y-4';let p = document.createElement('p');p.className = 'text-3xl font-bold';p.textContent = '            Clases, profesores y horas';div0.appendChild(p);let p1 = document.createElement('p');p1.className = 'text-lg';p1.textContent = '            Ingresa todas las clases con los profesores que te gustaría cursar y algunos sustitutos, entre más, mejor.';div0.appendChild(p1);let div2 = document.createElement('div');div2.className = 'flex flex-col justify-between p-6 h-[85%] rounded-2xl bg-sidebar-0 dark:bg-sidebar-1';let table = document.createElement('table');table.className = 'table-fixed';let thead = document.createElement('thead');let tr = document.createElement('tr');let th = document.createElement('th');th.className = 'w-24';th.textContent = '                            Grupo';tr.appendChild(th);let th3 = document.createElement('th');th3.className = 'w-[30%] text-left';th3.textContent = '                            Nombre';tr.appendChild(th3);let th4 = document.createElement('th');th4.className = 'w-[30%] text-left';th4.textContent = '                            Profesor';tr.appendChild(th4);let th5 = document.createElement('th');th5.className = 'w-16';th5.textContent = '                            Lun';tr.appendChild(th5);let th6 = document.createElement('th');th6.className = 'w-16';th6.textContent = '                            Mar';tr.appendChild(th6);let th7 = document.createElement('th');th7.className = 'w-16';th7.textContent = '                            Mie';tr.appendChild(th7);let th8 = document.createElement('th');th8.className = 'w-16';th8.textContent = '                            Jue';tr.appendChild(th8);let th9 = document.createElement('th');th9.className = 'w-16';th9.textContent = '                            Vie';tr.appendChild(th9);let th10 = document.createElement('th');th10.textContent = '                            Preferencia';tr.appendChild(th10);let th11 = document.createElement('th');th11.className = 'invisible';th11.textContent = '                            act';tr.appendChild(th11);thead.appendChild(tr);table.appendChild(thead);let tbody = document.createElement('tbody');table.appendChild(tbody);div2.appendChild(table);let div12 = document.createElement('div');div12.className = 'flex justify-between';let div13 = document.createElement('div');div13.className = 'self-center flex space-x-4 invisible';let button = document.createElement('button');button.className = 'flex p-4 w-64 rounded-xl text-white bg-ipn-0';let i = document.createElement('i');i.className = 'self-center h-6';i.setAttribute('id', 'tableIcon');button.appendChild(i);let span = document.createElement('span');span.className = 'ps-2 self-center';span.textContent = '                            Seleccionar CSV…';button.appendChild(span);div13.appendChild(button);let button14 = document.createElement('button');button14.className = 'flex p-4 w-64 rounded-xl text-white bg-ipn-0';let i15 = document.createElement('i');i15.className = 'self-center h-6';i15.setAttribute('id', 'saveIcon');button14.appendChild(i15);let span16 = document.createElement('span');span16.className = 'ps-2 self-center';span16.textContent = '                            Guardar CSV…';button14.appendChild(span16);div13.appendChild(button14);div12.appendChild(div13);let p17 = document.createElement('p');p17.className = 'self-center';p17.textContent = '                    Tip: Puedes seleccionar copiar y pegar la hora directamente del SAES. Visita la sección de ayuda';div12.appendChild(p17);div2.appendChild(div12);div0.appendChild(div2);div.appendChild(div0);let div18 = document.createElement('div');div18.setAttribute('id', 'pageButtons');div.appendChild(div18);div.id = 'data_container';document.getElementById('data_container').replaceWith(div);}
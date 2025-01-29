function configPage() {let div = document.createElement('div');div.className = 'flex flex-col justify-between w-full h-full p-6 lg:p-12 space-y-6 rounded-2xl shadow-2xl bg-body-0 dark:bg-body-1';let div0 = document.createElement('div');div0.className = 'space-y-3 lg:space-y-4';let p = document.createElement('p');p.className = 'text-2xl lg:text-3xl font-bold';p.textContent = '            Parámetros de configuración';div0.appendChild(p);let p1 = document.createElement('p');p1.className = 'lg:text-lg';p1.textContent = '            En esta sección puedes elegir cuantos horarios generar y cuantas materias tendrá cada uno';div0.appendChild(p1);let div2 = document.createElement('div');div2.className = 'space-y-4';let div3 = document.createElement('div');div3.className = 'flex justify-between';let label = document.createElement('label');label.className = 'w-1/2 lg:w-1/4 text-sm lg:text-base';label.setAttribute('for', 'schedulesAmount');label.textContent = '                    Cantidad de horarios';div3.appendChild(label);let select = document.createElement('select');select.className = 'appearance-none w-1/2 lg:w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';select.setAttribute('id', 'schedulesAmount');let option = document.createElement('option');option.setAttribute('value', '1');option.selected = true;option.textContent = '                        El mejor';select.appendChild(option);let option4 = document.createElement('option');option4.setAttribute('value', '3');option4.disabled = true;option4.textContent = '                        Los mejores tres';select.appendChild(option4);let option5 = document.createElement('option');option5.setAttribute('value', '5');option5.disabled = true;option5.textContent = '                        Los mejores cinco';select.appendChild(option5);let option6 = document.createElement('option');option6.setAttribute('value', '10');option6.disabled = true;option6.textContent = '                        Los mejores diez';select.appendChild(option6);div3.appendChild(select);div2.appendChild(div3);let div7 = document.createElement('div');div7.className = 'flex justify-between';let label8 = document.createElement('label');label8.className = 'w-1/2 lg:w-1/4 text-sm lg:text-base';label8.setAttribute('for', 'coursesPerSchedule');label8.textContent = '                    Cantidad de materias por horario';div7.appendChild(label8);let input = document.createElement('input');input.className = 'w-1/2 lg:w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';input.setAttribute('id', 'coursesPerSchedule');input.setAttribute('value', '5');input.setAttribute('type', 'number');input.setAttribute('min', '3');input.setAttribute('max', '12');div7.appendChild(input);div2.appendChild(div7);let div9 = document.createElement('div');div9.className = 'flex justify-between';let label10 = document.createElement('label');label10.className = 'w-1/2 lg:w-1/4 text-sm lg:text-base';label10.setAttribute('for', 'gapBetweenClasses');label10.textContent = '                    Horas entre clases para contar como espacio';div9.appendChild(label10);let input11 = document.createElement('input');input11.className = 'w-1/2 lg:w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';input11.setAttribute('id', 'gapBetweenClasses');input11.setAttribute('value', '01:30');input11.setAttribute('type', 'text');div9.appendChild(input11);div2.appendChild(div9);let div12 = document.createElement('div');div12.className = 'flex justify-between';let label13 = document.createElement('label');label13.className = 'w-1/2 lg:w-1/4 text-sm lg:text-base';label13.setAttribute('for', 'preferAllDayEmptySchedules');label13.textContent = '                    Dar preferencia a horarios con días vacíos';div12.appendChild(label13);let select14 = document.createElement('select');select14.className = 'appearance-none w-1/2 lg:w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';select14.setAttribute('id', 'preferAllDayEmptySchedules');let option15 = document.createElement('option');option15.setAttribute('value', '1');option15.textContent = '                        Preferible';select14.appendChild(option15);let option16 = document.createElement('option');option16.setAttribute('value', '0');option16.textContent = '                        Moderadamente preferible';select14.appendChild(option16);let option17 = document.createElement('option');option17.setAttribute('value', '-1');option17.selected = true;option17.textContent = '                        Evitar';select14.appendChild(option17);div12.appendChild(select14);div2.appendChild(div12);let p18 = document.createElement('p');p18.className = 'text-2xl font-bold';p18.textContent = '                Generador';div2.appendChild(p18);let div19 = document.createElement('div');div19.className = 'flex justify-between';let label20 = document.createElement('label');label20.className = 'w-1/2 lg:w-1/4 text-sm lg:text-base';label20.setAttribute('for', 'combinationsPerPopulation');label20.textContent = '                    Cantidad de individuos por población';div19.appendChild(label20);let input21 = document.createElement('input');input21.className = 'w-1/2 lg:w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';input21.setAttribute('id', 'combinationsPerPopulation');input21.setAttribute('value', '2000');input21.setAttribute('type', 'number');input21.setAttribute('min', '1000');input21.setAttribute('max', '10000');div19.appendChild(input21);div2.appendChild(div19);let div22 = document.createElement('div');div22.className = 'flex justify-between';let label23 = document.createElement('label');label23.className = 'w-1/2 lg:w-1/4 text-sm lg:text-base';label23.setAttribute('for', 'generations');label23.textContent = '                    Poblaciones para encontrar mínimo';div22.appendChild(label23);let input24 = document.createElement('input');input24.className = 'w-1/2 lg:w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-ipn-0 focus:border-ipn-0 dark:bg-sidebar-1 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ipn-0 dark:focus:border-ipn-0';input24.setAttribute('id', 'generations');input24.setAttribute('value', '30');input24.setAttribute('type', 'number');input24.setAttribute('min', '10');input24.setAttribute('max', '1000');div22.appendChild(input24);div2.appendChild(div22);div0.appendChild(div2);div.appendChild(div0);let div25 = document.createElement('div');div25.setAttribute('id', 'pageButtons');div.appendChild(div25);div.id = 'data_container';document.getElementById('data_container').replaceWith(div);}
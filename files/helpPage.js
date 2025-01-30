function helpPage() {let div = document.createElement('div');div.className = 'flex flex-col w-full h-full p-6 lg:p-12 rounded-2xl shadow-2xl bg-body-0 dark:bg-body-1 text-justify';let div0 = document.createElement('div');let p = document.createElement('p');p.className = 'text-2xl lg:text-3xl font-bold';p.textContent = '            Sección de ayuda';div0.appendChild(p);let p1 = document.createElement('p');p1.className = 'my-4 text-sm lg:text-lg';p1.textContent = '            En esta página encontrarás algunas aseveraciones y explicaciones que pueden apoyarte al momento de utilizar la aplicación.';div0.appendChild(p1);div.appendChild(div0);let div2 = document.createElement('div');div2.className = 'h-[90%] overflow-y-auto space-y-4 lg:space-y-6';let section = document.createElement('section');section.className = 'space-y-4 lg:space-y-6';let p3 = document.createElement('p');p3.className = 'text-2xl font-bold indent-4';p3.textContent = '                Clases, profesores y horas';section.appendChild(p3);let details = document.createElement('details');details.className = 'p-4 rounded-xl bg-sidebar-0 dark:bg-sidebar-1';let summary = document.createElement('summary');summary.className = 'font-bold indent-8';summary.textContent = '                    Copiar y pegar horario del SAES';details.appendChild(summary);let div4 = document.createElement('div');let p5 = document.createElement('p');p5.textContent = '                        Una forma rápida de llenar formularios es copiar y pegar, ¿cierto? Por eso al momento de agregar una clase puedes pegar el horario completo, evitándote tener que escribir todos los campos. Para esto sigue los pasos:';div4.appendChild(p5);let ol = document.createElement('ol');ol.className = 'list-decimal pl-8';let li = document.createElement('li');li.textContent = '                            Busca en el SAES la clase que quieres agregar.';ol.appendChild(li);let li6 = document.createElement('li');let p7 = document.createElement('p');p7.textContent = '                                Selecciona el renglón.';li6.appendChild(p7);let img = document.createElement('img');img.setAttribute('alt', 'Renglón seleccionado donde se lee PROFESOR 2');img.setAttribute('src', 'assets/saes.png');li6.appendChild(img);ol.appendChild(li6);let li8 = document.createElement('li');li8.textContent = '                            Presiona en "Agregar materia"';ol.appendChild(li8);let li9 = document.createElement('li');let p10 = document.createElement('p');p10.textContent = '                                Pega en cualquiera de los campos de texto.';li9.appendChild(p10);let img11 = document.createElement('img');img11.setAttribute('alt', 'Video corto donde se visualiza el pegado del renglón');img11.setAttribute('src', 'assets/paste.gif');li9.appendChild(img11);ol.appendChild(li9);let li12 = document.createElement('li');li12.textContent = '                            Selecciona el nivel de preferencia por la clase.';ol.appendChild(li12);div4.appendChild(ol);let div13 = document.createElement('div');div13.className = 'p-4 rounded-xl bg-red-100 mt-4';let p14 = document.createElement('p');p14.className = 'text-red-500 font-bold indent-12';p14.textContent = '                            ¡Atención!';div13.appendChild(p14);let p15 = document.createElement('p');p15.className = 'text-red-800';p15.textContent = '                            No es posible pegar multiples renglones al mismo tiempo, por lo que solo se verá reflejado el primer reglón seleccionado.';div13.appendChild(p15);div4.appendChild(div13);details.appendChild(div4);section.appendChild(details);div2.appendChild(section);let section16 = document.createElement('section');section16.className = 'space-y-4 lg:space-y-6';let p17 = document.createElement('p');p17.className = 'text-2xl font-bold indent-4';p17.textContent = '                Parámetros de configuración';section16.appendChild(p17);let details18 = document.createElement('details');details18.className = 'p-4 rounded-xl bg-sidebar-0 dark:bg-sidebar-1';let summary19 = document.createElement('summary');summary19.className = 'font-bold indent-8';summary19.textContent = '                    Horas entre clases para contar como espacio';details18.appendChild(summary19);let p20 = document.createElement('p');p20.textContent = '                    El parámetro "Horas entre clases para contar como espacio" es un campo configurable con el que puedes indicarle a la aplicación una cantidad determinada de tiempo.                     Esta cantidad de tiempo cuantifica las horas y minutos que debe haber entre dos clases para considerar que hay una "hora muerta". Por defecto es 01:30 hrs y el rango va de 00:01 hrs (un minuto) hasta 03:59 hrs.';details18.appendChild(p20);section16.appendChild(details18);let details21 = document.createElement('details');details21.className = 'p-4 rounded-xl bg-sidebar-0 dark:bg-sidebar-1';let summary22 = document.createElement('summary');summary22.className = 'font-bold indent-8';summary22.textContent = '                    Dar preferencia a horarios con días vacíos';details21.appendChild(summary22);let p23 = document.createElement('p');p23.textContent = '                    Este parámetro permite indicarle a la aplicación si son preferibles los horarios donde hay días completos sin clases o no. El modelo interno de la aplicación implementa la funcionalidad, ¿pero funciona? ¯\\_(ツ)_/¯';details21.appendChild(p23);section16.appendChild(details21);let details24 = document.createElement('details');details24.className = 'p-4 rounded-xl bg-sidebar-0 dark:bg-sidebar-1';let summary25 = document.createElement('summary');summary25.className = 'font-bold indent-8';summary25.textContent = '                    Cantidad de individuos por población';details24.appendChild(summary25);let div26 = document.createElement('div');div26.className = 'space-y-2';let p27 = document.createElement('p');p27.textContent = '                        Esta opción permite ajustar la cantidad de combinaciones de clases que la aplicación probará para buscar el mínimo óptimo. En otras palabras, es la cantidad de horarios que va a generar la aplicación para encontrar el mejor horario.                         Por defecto el valor es 2000 y puede ajustarse a un valor entre 500 y 100,000.';div26.appendChild(p27);let div28 = document.createElement('div');div28.className = 'p-4 rounded-xl bg-red-100';let p29 = document.createElement('p');p29.className = 'text-red-500 font-bold indent-12';p29.textContent = '                            ¡Atención!';div28.appendChild(p29);let p30 = document.createElement('p');p30.className = 'text-red-800';p30.textContent = '                            Subir demasiado el valor de este parámetro puede causar que la aplicación se congele y bajarlo puede causar resultados no óptimos o que no pueda generar todos los horarios solicitados. Se recomiendan valores entre 2000 y 5000.';div28.appendChild(p30);div26.appendChild(div28);details24.appendChild(div26);section16.appendChild(details24);let details31 = document.createElement('details');details31.className = 'p-4 rounded-xl bg-sidebar-0 dark:bg-sidebar-1';let summary32 = document.createElement('summary');summary32.className = 'font-bold indent-8';summary32.textContent = '                    Poblaciones para encontrar mínimo';details31.appendChild(summary32);let div33 = document.createElement('div');div33.className = 'space-y-2';let p34 = document.createElement('p');p34.textContent = '                        Esta opción permite ajustar la cantidad de veces que se repite el proceso de buscar el mínimo óptimo. La cantidad de veces que la aplicación buscará el mínimo óptimo es: (Cantidad de individuos por población) x (Poblaciones para encontrar mínimo). Por defecto el valor es 15 y puede ajustarse a un valor entre 5 y 1000.';div33.appendChild(p34);let div35 = document.createElement('div');div35.className = 'p-4 rounded-xl bg-red-100';let p36 = document.createElement('p');p36.className = 'text-red-500 font-bold indent-12';p36.textContent = '                            ¡Atención!';div35.appendChild(p36);let p37 = document.createElement('p');p37.className = 'text-red-800';p37.textContent = '                            Subir demasiado el valor de este parámetro puede causar que la aplicación se congele y bajarlo puede causar resultados no óptimos o que no pueda generar todos los horarios solicitados. Se recomiendan valores entre 15 y 50.';div35.appendChild(p37);div33.appendChild(div35);details31.appendChild(div33);section16.appendChild(details31);div2.appendChild(section16);let section38 = document.createElement('section');section38.className = 'space-y-4 lg:space-y-6';let p39 = document.createElement('p');p39.className = 'text-2xl font-bold indent-4';p39.textContent = '                Generar';section38.appendChild(p39);let details40 = document.createElement('details');details40.className = 'p-4 rounded-xl bg-sidebar-0 dark:bg-sidebar-1';let summary41 = document.createElement('summary');summary41.className = 'font-bold indent-8';summary41.textContent = '                    Columna de intercambio';details40.appendChild(summary41);let div42 = document.createElement('div');let p43 = document.createElement('p');p43.textContent = '                        Al generar horarios, la columna de Intercambiable indica que los dos horarios adyacentes del mismo color comparten las mismas horas y la misma preferencia, por lo que al final puedes escoger cualquiera de los sugeridos.';div42.appendChild(p43);let p44 = document.createElement('p');p44.textContent = '                        Por ejemplo en la siguiente imagen se ven en color morado COMPILADORES y PROCESAMIENTO DIGITAL DE SEÑALES, el usuario al final decide cuál de las dos materias quiere inscribir.';div42.appendChild(p44);let img45 = document.createElement('img');img45.setAttribute('alt', 'La imagen no cargo xd');img45.setAttribute('src', 'assets/swappable.png');div42.appendChild(img45);details40.appendChild(div42);section38.appendChild(details40);let details46 = document.createElement('details');details46.className = 'p-4 rounded-xl bg-sidebar-0 dark:bg-sidebar-1';let summary47 = document.createElement('summary');summary47.className = 'font-bold indent-8';summary47.textContent = '                    Horarios contienen materias duplicadas en diferentes horas';details46.appendChild(summary47);let p48 = document.createElement('p');p48.textContent = '                    En algunos casos es posible que la aplicación genere horarios que contienen repetidas dos materias en diferentes horas. Desafortunadamente, aún no se implementa un mecanismo para la detección y prevención de estos casos, por lo que la recomendación es que se agreguen más materias para cualquiera de las horas afectadas con la misma o mayor preferencia.';details46.appendChild(p48);section38.appendChild(details46);div2.appendChild(section38);div.appendChild(div2);div.id = 'data_container';document.getElementById('data_container').replaceWith(div);}
# IPN Scheduler

Aplicación web para la generación de horarios

### Descripción
Esta herramienta tiene como objetivo ayudar a los 
estudiantes del IPN a crear horarios de forma rápida y 
sencilla, teniendo en cuenta la preferencia por una 
determinada unidad de aprendizaje y evitando las horas 
muertas entre clases.

### Copyright
<pre>
The MIT License (MIT)

Copyright (c) 2025 cdelaof26

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
</pre>

La licencia del MIT solo aplica a **versiones superiores a la 
0.0.7**. Esto implica que cualquier persona que obtenga una copia 
de este software puede utilizarlo y modificarlo libremente.

El Instituto Politécnico Nacional (IPN) no esta afiliado a 
este proyecto de ninguna manera.

### Dependencias
Esta página web requiere únicamente un navegador web con 
soporte para HTML5, JS y CSS3.

Para el desarrollo se requiere de lo siguiente:
- Navegador web
- Python >= 3.9
  - Se hace uso del proyecto [PyWST](https://github.com/cdelaof26/PyWST)
- Tailwind CSS
  - Requiere NodeJS
  - Opcionalmente: [Tailwind Standalone CLI](https://tailwindcss.com/blog/standalone-cli)

### Desarrollo
```bash
# Clona el repositorio
git clone https://github.com/cdelaof26/IPNScheduler.git
```

```bash
# Ingresa al directorio del proyecto
cd IPNScheduler
```

#### Ejecuta TailwindCSS Standalone CLI

```bash
./tailwindcss --input CSS/tin.css --output CSS/tout.css --watch --minify
```

#### Ejecuta PyWST
```bash
# En el directorio de PyWST
python3 main.py --config --file /ruta/a/IPNScheduler/pywst.config

# Usuarios en Windows quizá tengan que cambiar python3 por python
```

> [!IMPORTANT]  
> Es necesario agregar la ruta absoluta del proyecto para cada `PATH` en `pywst.config`


### Historial de cambios

#### v0.1.3-1
- Agregado selector de horas alternativo en 
  `dataCollector` junto a información relevante 
  en la página de ayuda
- Agregado buscador en página de herramientas
- Corrección de error donde no se limpiaban correctamente 
  los selectores de archivos
- Agregado método alternativo de extracción de horarios 
  "Selector directo"
- Agregado soporte para subir multiples archivos CSV

#### v0.1.0
- Rediseño general
  - Agregado logo
  - Agregado nav como dropdown menu para dispositivos móviles
  - Consistencia mejorada en todas las páginas
  - Migración de `svg.js` a archivos individuales
  - Mejorada la responsividad en general
  - Mejora de la pantalla de mensaje de error cuando 
    JavaScript está desactivado
  - Agregado modo a pantalla completa para visualizar los
    horarios generados
- Arreglado error donde el `Script Horarios de clases` 
  no recogía el último elemento de la tabla
- Los horarios generados ya no desaparecen al cambiar de 
  página
- **TODO**: Refactoring

#### v0.0.9_2
- Migración a Tailwind CSS 4
- Migración de `translate.py` a [PyWST](https://github.com/cdelaof26/PyWST)

#### v0.0.9_1
- Corrección de errores
- Botón de seleccionar y deseleccionar todo en página de herramientas

#### v0.0.9
- Página de herramientas

#### v0.0.8_1
- Mejorada la claridad de algunos mensajes
- Eliminar una materia ya no desplaza la vista al final

#### v0.0.8
- Implementada generación de multiples horarios
- Implementado guardar horarios como CSV
- Parámetros de configuración modificados

#### v0.0.7
- Página de ayuda
- Mejora del diseño de `dataCollector`
- Cambio en el rango de poblaciones

#### v0.0.6
- Diseño responsivo
- Corrección de errores
- Agregado parámetro de configuración para horarios con días libres
- Agregado exportar CSV
- Los colores de los horarios generados ahora son diferentes

#### v0.0.5
- Página de generación de horarios
- Agregado importar CSV

#### v0.0.4
- Página de configuración
- ~~`translate.py` acepta~~ 
  - ~~Parcialmente `selected`, `disabled` y `hidden`~~
    - ~~Ciertamente no es el mejor traductor HTML-JS~~
  - ~~Completamente `type`, `min`, `max`~~

#### v0.0.3
- Página de recopilación de datos completa
- ~~`translate.py` acepta `value`~~ 

#### v0.0.2
- Página de funcionamiento
- Página de créditos
- Página de recopilación de datos [WIP]
- ~~`translate.py` acepta `placeholder`~~

#### v0.0.1
- Proyecto inicial

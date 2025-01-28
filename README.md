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
https://github.com/cdelaof26
</pre>

Por el momento, este software no contiene una licencia, por
lo que todos los derechos están reservados - [@cdelaof26](https://github.com/cdelaof26).

El Instituto Politécnico Nacional (IPN) no esta afiliado a 
este proyecto de ninguna manera.

### Dependencias
Esta página web requiere únicamente un navegador web con 
soporte para HTML5, JS y CSS3.

Para el desarrollo se requiere de lo siguiente:
- Navegador web
- Python >= 3.9
- Tailwind CSS
  - Requiere NodeJS
  - Opcionalmente: [Tailwind Standalone CLI](https://tailwindcss.com/blog/standalone-cli)

### Desarrollo
```bash
# Clonar el repositorio
$ git clone https://github.com/cdelaof26/IPNScheduler.git

# Ingresar al repositorio
$ cd IPNScheduler

# Iniciar Tailwind CSS watcher (Standalone CLI)
$ ./tailwindcss -i ./CSS/tin.css -o ./CSS/tout.css --watch

# Iniciar python transcriptor
$ python3 auto_trans.py

#   Windows
$ python auto_trans.py

# De forma opcional agregar
#    < meta http-equiv="refresh" content="3" >
# al fichero index.html
```


### Componentes en python
Debido a que no es del todo posible utilizar _React_ sin NodeJS, 
la _solución_ fue escribir varios scripts de Python para la 
transcripción de HTML a JS.

| Script          | Descripción                                              | CLI args                           | 
|-----------------|----------------------------------------------------------|------------------------------------|
| `code.py`       | Se encarga de mantener el código JS en una estructura    | N/A                                |
| `fix_indent.py` | Cambia los espacios por tabuladores en archivos HTML     | N/A                                |
| `translate.py`  | Transcribe el código HTML a JS                           | Ruta del archivo HTML [ opcional ] |
| `auto_trans.py` | Ejecuta de forma continua `translate.py` cada 3 segundos | N/A                                |


### Historial de cambios

#### v0.0.1
- Proyecto inicial

# Binary Hotel 🏨

Aplicación web interactiva basada en una única pregunta, en la que el usuario debe encontrar una habitación específica dentro de una estructura laberíntica.

## Tabla de Contenidos

- [Introducción](#introducción)
- [Características principales](#características-principales)
- [Input y Output](#input-y-output)
- [Instalación](#instalación)
- [Convenciones](#convenciones)
- [Figma](#figma)

## Introducción

**Binary Hotel** es una experiencia interactiva de una sola pregunta donde el jugador debe encontrar una habitación específica dentro de un hotel con túneles y habitaciones numeradas.

**Pregunta de ejemplo:**

> *Encuentra la habitación con el número **1337**. Haz clic en 'Guardar' una vez la hayas encontrado.*

El usuario navegará visualmente por el hotel haciendo clic en las puertas hasta encontrar el número objetivo.

## Características principales

- **Configuración personalizada de la pregunta única**.
- **Visualización interactiva** para explorar habitaciones con clics.
- **Autogeneración o ingreso manual** de habitaciones.
- **Modo de juego inmediato** o a través de link generado.

## Input y Output

### Input del Frontend

**Input del usuario (desde el editor):**
- Editar el enunciado de la pregunta.
- Establecer el tamaño de la lista de habitaciones.
- Ingresar manualmente los números de habitación.
- Opción de autollenado de la lista con un botón.
- Elegir el número de habitación objetivo (ej: 1337).
- Botón **"Compartir a tus amigos"**: genera un link para jugar más tarde.
- Botón **"Responder Ahora"**: inicia el juego directamente.
### Output del Frontend
**Output del frontend:**
Un objeto JSON con toda la configuración enviada al servidor.

```json
{
  "enunciado": "Encuentra la habitación con el número 1337.",
  "habitaciones": [102, 301, 1337, 204, 333, 382, 193, 374, 110, 90],
  "tamañoLista": 10,
  "numeroObjetivo": 1337,
  "numeroDeInicio": 850
}
```
### Input del Back
- Recibe el JSON generado por el frontend.
### Output del Back
- Devuelve exactamente el mismo JSON para ser utilizado en el juego.
## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ManuStrong98/proyectoWeb.git

# Entrar al directorio del proyecto
cd proyectoWeb

# Instalar dependencias
npm install

# Iniciar la aplicación en modo desarrollo
npm start
```
## Convenciones
[Documento de las convenciones, practicas, tecnologias que usa el equipo.](https://docs.google.com/document/d/1kX_qCZVPHPTU996STJoCCOa58g1sS-dC9Q9dnmUNsrs/edit?usp=sharing)

## Figma
https://www.figma.com/design/X1iSWl4HDM2ElcZwX8EO7A/preguntas-interactivas?node-id=0-1&t=SZSHnxwTE02dfNyU-1

# Binary Hotel 🏨

Aplicación web interactiva basada en una única pregunta, en la que el usuario debe encontrar una habitación específica dentro de una estructura laberíntica. También incluye un segundo modo de juego temático llamado "Galáctico", que comparte la misma lógica.

## Tabla de Contenidos

* [Introducción General](#introducción-general)
* [Características principales](#características-principales)
* [Instalación](#instalación)
* [Tutorial del Juego y Edición](#tutorial-del-juego-y-edición)
* [Convenciones](#convenciones)
* [Figma](#figma)

## Introducción General

**Binary Hotel** es una experiencia interactiva donde el jugador debe encontrar una habitación específica utilizando una búsqueda binaria visual. La aplicación permite al usuario autenticarse, editar la configuración del juego y compartir su versión personalizada mediante un enlace.

### Juegos disponibles:

* **Hotel Binario** 🏨
* **Galáctico** 🌌

Ambos juegos comparten la misma mecánica pero con diferentes estéticas.

### Características destacadas:

* Inicio de sesión seguro.
* Edición del enunciado, lista de números y número objetivo.
* Tres modos de acción: **Guardar juego**, **Iniciar juego**, **Compartir misión BST**.
* Compartir enlaces para que cualquiera pueda jugar (sin necesidad de iniciar sesión).

## Características principales

* ✨ **Configuración personalizada de la pregunta única**.
* 🔍 **Visualización interactiva** para explorar habitaciones con clics.
* 📅 **Autogeneración o ingreso manual** de habitaciones.
* ⏱️ **Modo de juego inmediato** o a través de link generado.
* 🔐 **Edición exclusiva para usuarios logueados**.
* 📂 **Dos juegos disponibles**: Galáctico y Hotel Binario.

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

## Tutorial del Juego y Edición

### 1. Inicio de sesión

Para acceder a las funciones de edición, primero debes iniciar sesión:

Credenciales disponibles:
- **Usuario 1:**
  - Usuario: [karla@example.com](mailto:karla@example.com)
  - Password: 1234
- **Usuario 2:**
  - Usuario: [yerko@gmail.com](mailto:yerko@gmail.com)
  - Password: 1234
### 2. Selección de juego

Después del login, podrás elegir entre:

* **Hotel Binario**
* **Galáctico**

Ambos juegos te llevarán a una interfaz para editar los siguientes campos:

* Enunciado del juego.
* Lista de habitaciones (números).
* Número objetivo a encontrar.

### 3. Acciones disponibles

Una vez configurado el juego, hay tres botones importantes:

* ✉️ **Enviar al servidor:** Guarda la configuración actual del juego en la base de datos.
* ⚖️ **Iniciar Búsqueda Binaria:** Comienza inmediatamente el juego en la interfaz interactiva.
* 🔗 **Compartir Misión BST:** Genera un enlace del juego que puede ser enviado a cualquier persona. No es necesario que el receptor del link esté logueado para jugar.

### 4. Jugando desde un link

Si accedes a un link compartido, podrás jugar directamente sin necesidad de estar registrado o iniciar sesión.

## Convenciones

[Documento de las convenciones, prácticas, tecnologías que usa el equipo.](https://docs.google.com/document/d/1kX_qCZVPHPTU996STJoCCOa58g1sS-dC9Q9dnmUNsrs/edit?usp=sharing)

## Figma

[https://www.figma.com/design/X1iSWl4HDM2ElcZwX8EO7A/preguntas-interactivas?node-id=0-1\&t=SZSHnxwTE02dfNyU-1](https://www.figma.com/design/X1iSWl4HDM2ElcZwX8EO7A/preguntas-interactivas?node-id=0-1&t=SZSHnxwTE02dfNyU-1)

# 🎮 Proyecto Backend - Juego Interactivo

Este es un servidor backend hecho con **Node.js**, **Express** y **TypeScript**, diseñado para servir contenido interactivo de un juego.


## 🚀 Cómo ejecutar el proyecto

### 1. Instalar dependencias

Desde la carpeta `backend/`, ejecuta:

```bash
npm install
npm run dev
```
### 2. BD
```bash
Nombre de la conexión: prograWeb
Host: shinkansen.proxy.rlwy.net
Puerto: 19883
Base de datos: railway
Usuario: postgres
password: mMlWLHppMhzRnLpxBUAxAUqGcYHTntsq

# script
$env:PGPASSWORD="mMlWLHppMhzRnLpxBUAxAUqGcYHTntsq"
psql -h shinkansen.proxy.rlwy.net -p 19883 -U postgres -d railway
```
# Tutorial de Uso de las APIs

Este documento proporciona una guía rápida para probar las APIs desarrolladas usando `curl`. También puedes utilizar herramientas como [Postman](https://www.postman.com/) para hacer pruebas de manera más visual, pero en este tutorial los ejemplos están escritos únicamente con `curl`.

---

## 1. Iniciar sesión (Login)

**Endpoint:** `POST http://localhost:3001/v1/login`

**Descripción:** Este endpoint permite iniciar sesión y obtener un token JWT necesario para acceder a los endpoints protegidos.

### Solicitud

```bash
curl -X POST http://localhost:3001/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "karla@example.com",
    "password": "1234"
  }'
```

### Respuesta esperada

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "usuario": "karla",
    "nombre_completo": "Karla Example",
    "correo": "karla@example.com",
    "password": "1234"
  }
}
```

Guarda el `token` recibido para autenticarte en los siguientes endpoints.

---

## 2. Crear nuevo juego

**Endpoint:** `POST http://localhost:3001/auth/v1/juegos/1`

**Descripción:** Crea un nuevo juego en la base de datos. Este endpoint está protegido y requiere autenticación con Bearer Token.

Este endpoint tiene como parametro `:id` /auth/v1/juegos/1, si quieres crear para el usuario 4, entonces: /auth/v1/juegos/4

### Solicitud

```bash
curl -X POST http://localhost:3001/auth/v1/juegos/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "tipoDeJuego": "galactico",
    "enunciado": "Acierta el número secreto",
    "habitaciones": [1, 2, 3, 4, 5],
    "tamanioLista": 5,
    "numeroObjetivo": 42,
    "numeroDeInicio": 10,
    "enlacePublico": "https://miapp.com/juegos/abc123",
    "enlaceDeImagen": "https://miapp.com/images/juego.png"
  }'
```

### Respuesta esperada

```json
{
  "message": "Juego insertado correctamente",
  "juegoId": 4
}
```

---

## 3. Obtener el último juego creado

**Endpoint:** `GET http://localhost:3001/auth/v1/juegos/ultimo/1/hotel_binario`

**Descripción:** Obtiene el último juego creado de tipo `hotel_binario` para el usuario con ID `1`. Este endpoint también requiere autenticación.


Este endpoint tiene 2 parametros `:id` y `:tipo_de_juego` /auth/v1/juegos/ultimo/1/hotel_binario, si quieres ver el ultimo juego del usuario 4 con el tipo de juego galactivo, entonces /auth/v1/juegos/ultimo/4/galactico

### Solicitud

```bash
curl -X GET http://localhost:3001/auth/v1/juegos/ultimo/1/hotel_binario \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Respuesta esperada

```json
{
  "id": 2,
  "enunciado": "Encuentra la habitación con el número 1337.",
  "habitaciones": [
    102, 301, 1337, 204, 333, 382, 193, 374, 110, 90
  ],
  "tamanio_lista": 10,
  "numero_objetivo": 1337,
  "numero_de_inicio": 850,
  "fecha_creacion": "2025-06-10T09:35:54.370Z",
  "enlace_publico": null,
  "enlace_de_imagen": "https://hotel-binario-saga-arashiyama.hotels-in-kyoto.com/data/Photos/OriginalPhoto/15399/1539970/1539970123/kyoto-hotel-binario-saga-arashiyama-photo-5.JPEG",
  "tipo_de_juego": "hotel_binario"
}
```
## 4. Obtener juego público para jugar (sin autenticación)

**Endpoint:** `GET http://localhost:3001/juego/:id/:tipo_de_juego`

**Descripción:** Este endpoint permite acceder a un juego compartido públicamente. No requiere autenticación. Es útil cuando un usuario ha creado un juego y ha compartido un enlace público para que otros puedan jugarlo directamente.

### Parámetros de la ruta

* `:id` — ID del usuario que compartió el juego.
* `:tipo_de_juego` — Tipo de juego (por ejemplo: `galactico`, `hotel_binario`, etc.).

### Ejemplo con `curl`

```bash
curl -X GET http://localhost:3001/juego/1/galactico
```

### Respuesta esperada

```json
{
  "id": 4,
  "enunciado": "Acierta el número secreto",
  "habitaciones": [
    1,
    2,
    3,
    4,
    5
  ],
  "tamanio_lista": 5,
  "numero_objetivo": 42,
  "numero_de_inicio": 10,
  "fecha_creacion": "2025-06-24T02:02:21.401Z",
  "enlace_publico": "https://miapp.com/juegos/abc123",
  "enlace_de_imagen": "https://miapp.com/images/juego.png",
  "tipo_de_juego": "galactico"
}
```

### Notas

* Este endpoint está diseñado para funcionar sin autenticación.

---

## Notas finales

* Todos los endpoints protegidos requieren el token JWT obtenido en el login.
* Reemplaza el token en los comandos `curl` por el que hayas obtenido en tu propia sesión.
* Puedes usar [Postman](https://www.postman.com/) si prefieres una interfaz gráfica para probar las solicitudes.

---

¡Feliz desarrollo! 🚀

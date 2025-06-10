-- 1. Crear base de datos
CREATE DATABASE juegos_db;

-- Cambiar a la base de datos recién creada (si usas psql o pgAdmin, puedes omitir esto si ya estás conectado)
\c juegos_db;

-- 2. Crear tabla juego
CREATE TABLE juego (
    id SERIAL PRIMARY KEY,
    enunciado TEXT NOT NULL,
    habitaciones JSONB NOT NULL,
    tamaño_lista INTEGER NOT NULL,
    numero_objetivo INTEGER NOT NULL,
    numero_de_inicio INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO juego (
    enunciado,
    habitaciones,
    tamaño_lista,
    numero_objetivo,
    numero_de_inicio
) VALUES (
    'Encuentra la habitación con el número 1337.',
    '[102, 301, 1337, 204, 333, 382, 193, 374, 110, 90]'::jsonb,
    10,
    1337,
    850
);


CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  contraseña VARCHAR(100) NOT NULL,
  nombre_completo VARCHAR(100),
  correo VARCHAR(100),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario de prueba
INSERT INTO usuario (usuario, contraseña, nombre_completo, correo)
VALUES ('karla', '1234', 'Karla Example', 'karla@example.com');


-- 1. Crear base de datos
CREATE DATABASE juegos_db;

-- Cambiar a la base de datos recién creada (si usas psql o pgAdmin, puedes omitir esto si ya estás conectado)
\c juegos_db;

-- 2. Crear tabla juego
CREATE TABLE juego (
    id SERIAL PRIMARY KEY,
    tipo_de_juego VARCHAR(50),
    enunciado TEXT NOT NULL,
    habitaciones JSONB NOT NULL,
    tamanio_lista INTEGER NOT NULL,
    numero_objetivo INTEGER NOT NULL,
    numero_de_inicio INTEGER NOT NULL,
    enlace_publico TEXT,
    enlace_de_imagen TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  nombre_completo VARCHAR(100),
  correo VARCHAR(100),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relación muchos-a-muchos: usuarios y juegos

CREATE TABLE usuario_juego (
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    juego_id INTEGER REFERENCES juego(id) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, juego_id)
);



-- importaciones
\i './pobladoDelaDB.sql'
\i './funciones.sql'

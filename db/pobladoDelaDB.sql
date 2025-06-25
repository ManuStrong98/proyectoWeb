-- Juego de prueba
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

-- Usuario de prueba
INSERT INTO usuario (usuario, contraseña, nombre_completo, correo)
VALUES ('karla', '1234', 'Karla Example', 'karla@example.com');

import { Request, Response } from 'express';
import pool from '../db/pool';

export const insertJuego = async (req: Request, res: Response) => {
  const {
    tipoDeJuego,
    enunciado,
    habitaciones,
    tamanioLista,
    numeroObjetivo,
    numeroDeInicio,
    enlacePublico,
    enlaceDeImagen,
  } = req.body;

  const usuarioId = parseInt(req.params.id);

  if (isNaN(usuarioId)) {
    return res.status(400).json({ error: 'El ID de usuario proporcionado no es válido' });
  }

  try {
    // Inserta el juego
    const result = await pool.query(
      `INSERT INTO juego 
        (tipo_de_juego, enunciado, habitaciones, tamanio_lista, numero_objetivo, numero_de_inicio, enlace_publico, enlace_de_imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        tipoDeJuego,
        enunciado,
        JSON.stringify(habitaciones),
        tamanioLista,
        numeroObjetivo,
        numeroDeInicio,
        enlacePublico || null,
        enlaceDeImagen || null,
      ]
    );

    const juegoId = result.rows[0].id;

    // Relación con usuario
    await pool.query(
      `INSERT INTO usuario_juego (usuario_id, juego_id) VALUES ($1, $2)`,
      [usuarioId, juegoId]
    );

    res.status(201).json({ message: 'Juego insertado correctamente', juegoId });
  } catch (error) {
    console.error('Error al insertar juego:', error);
    res.status(500).json({ error: 'Error al insertar el juego en la base de datos' });
  }
};

export const getUltimoJuego = async (req: Request, res: Response) => {
  const usuarioId = parseInt(req.params.id);
  const tipoDeJuego = req.params.tipo_de_juego;

  if (isNaN(usuarioId) || !tipoDeJuego) {
    return res.status(400).json({ error: 'Par├ímetros inv├ílidos' });
  }

  try {
    const { rows } = await pool.query(
	` SELECT j.*
	    FROM juego j
	JOIN usuario_juego uj ON j.id = uj.juego_id
	WHERE uj.usuario_id = $1 AND j.tipo_de_juego = $2
	ORDER BY j.fecha_creacion DESC
	LIMIT 1`,
	[usuarioId, tipoDeJuego]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'No se encontro un juego con ese tipo para el usuario' });
    }
  } catch (error) {
    console.error('Error al obtener el ultimo juego:', error);
    res.status(500).json({ error: 'Error al acceder a la base de datos' });
  }
}; 


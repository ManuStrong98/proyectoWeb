import { Request, Response } from 'express';
import pool from '../db/pool';

export const insertJuego = async (req: Request, res: Response) => {
  const {
    enunciado,
    habitaciones,
    tamanioLista,
    numeroObjetivo,
    numeroDeInicio,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO juego (enunciado, habitaciones, tamanio_lista, numero_objetivo, numero_de_inicio)
       VALUES ($1, $2, $3, $4, $5)`,
      [enunciado, JSON.stringify(habitaciones), tamanioLista, numeroObjetivo, numeroDeInicio]
    );
    res.json({ message: 'Juego insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar juego:', error);
    res.status(500).json({ error: 'Error al insertar el juego en la base de datos' });
  }
};

export const getUltimoJuego = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM juego ORDER BY fecha_creacion DESC LIMIT 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'No hay registros en la base de datos' });
    }
  } catch (error) {
    console.error('Error al obtener el último juego:', error);
    res.status(500).json({ error: 'Error al acceder a la base de datos' });
  }
};

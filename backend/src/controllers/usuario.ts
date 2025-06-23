import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import pool from './../db/pool'

interface Usuario {
  id: number
  usuario: string
  password: string
  nombre_completo: string
  correo: string
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { correo, password } = req.body
    console.log('BODY:', req.body);

  try {
    const result = await pool.query<Usuario>(
      'SELECT id, usuario, password, nombre_completo, correo FROM usuario WHERE correo = $1',
      [correo]
    )

    if (result.rowCount === 0) {
      res.status(401).json({ error: 'Usuario no encontrado' })
      return
    }

    const user = result.rows[0]

    if (user.password !== password) {
      res.status(401).json({ error: 'Contraseña incorrecta' })
      return
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.KEY_JWT as string,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        usuario: user.usuario,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        password: user.password // ⚠️ NO enviar esto en producción
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error en el proceso de inicio de sesión' })
  }
}


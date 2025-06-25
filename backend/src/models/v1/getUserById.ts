import pool from '../../db/pool';

export interface Usuario {
  id: number;
  usuario: string;
  password: string;
  nombre_completo: string | null;
  correo: string | null;
}

export const getUserById = async (id: number): Promise<Usuario | null> => {
  try {
    const query = `SELECT id,
			usuario,
			password,
			nombre_completo,
			correo
	FROM usuario WHERE id = $1`;

    const { rows } = await pool.query(query, [id]);

    if (rows.length > 0) {
      return rows[0] as Usuario;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    return null;
  }
};


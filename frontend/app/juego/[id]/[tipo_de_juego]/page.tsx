'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getJuego } from '../../../../src/lib/api';

type JuegoData = {
  id: number;
  enunciado: string;
  habitaciones: number[];
  tamanio_lista: number;
  numero_objetivo: number;
  numero_de_inicio: number;
  fecha_creacion: string;
  enlace_publico: string;
  enlace_de_imagen: string;
  tipo_de_juego: string;
};

export default function JuegoPage() {
  const params = useParams();
  const id = params?.id as string;
  const tipo_de_juego = params?.tipo_de_juego as string;

  const [juego, setJuego] = useState<JuegoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && tipo_de_juego) {
      getJuego(id, tipo_de_juego)
        .then(data => setJuego(data))
        .catch(err => {
          console.error('Error al obtener juego:', err);
          setError('Juego no encontrado');
        });
    }
  }, [id, tipo_de_juego]);
    console.log(juego);

  if (error) return <p>Error: {error}</p>;
  if (!juego) return <p>Cargando juego...</p>;

  return (
    <div>
      <h1>{juego.enunciado}</h1>
      <p>ID: {juego.id}</p>
      <p>Tipo: {juego.tipo_de_juego}</p>
      <p>Habitaciones: {juego.habitaciones.join(', ')}</p>
      <img src={juego.enlace_de_imagen} alt="Imagen del juego" style={{ width: 300 }} />
      <pre>{JSON.stringify(juego, null, 2)}</pre>
    </div>
  );
}


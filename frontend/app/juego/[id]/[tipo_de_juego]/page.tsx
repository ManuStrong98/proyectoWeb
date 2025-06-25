'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getJuego } from '../../../../src/lib/api';
import GalacticoJuego from '../../components/GalacticoJuego';
import HotelBinarioJuego from '../../components/HotelBinarioJuego';

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
  const userId = params?.id as string; // este es el ID del usuario creador
  const tipo_de_juego = params?.tipo_de_juego as string;

  const [juego, setJuego] = useState<JuegoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId && tipo_de_juego) {
      fetch(`http://localhost:3001/juego/${userId}/${tipo_de_juego}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Juego no encontrado');
          const data = await res.json();
          setJuego(data);
        })
        .catch(err => {
          console.error('Error al obtener juego:', err);
          setError('Juego no encontrado');
        });
    }
  }, [userId, tipo_de_juego]);

  if (error) return <p>Error: {error}</p>;
  if (!juego) return <p>Cargando juego...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>{juego.enunciado}</h1>
      {/* Mostrar componente según el tipo_de_juego */}
      {juego.tipo_de_juego === 'galactico' ? (
        <GalacticoJuego juego={juego} />
      ) : juego.tipo_de_juego == 'hotel_binario' ? (
        <HotelBinarioJuego juego={juego} />
      ) : (
        <p>Tipo de juego no soportado.</p>
      )}
    </div>
  );
}

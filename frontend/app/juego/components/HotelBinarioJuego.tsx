'use client';

import React from 'react';

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

export default function HotelBinarioJuego({ juego }: { juego: JuegoData }) {
  return (
    <div className="p-4 border border-green-500 rounded-md">
      <h2>🏨 Juego Hotel Binario</h2>
      <pre>{JSON.stringify(juego, null, 2)}</pre>
    </div>
  );
}

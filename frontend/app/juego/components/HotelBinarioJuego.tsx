'use client';

import React, { useEffect, useState } from 'react';
import GameInterface from '../../../components/game-interface';

// Tipo que representa el formato de los datos del juego
interface JuegoData {
  id: number;
  enunciado: string;
  habitaciones: number[];
  tamanio_lista: number;
  numero_objetivo: number;
  numero_de_inicio: number;
  fecha_creacion: string;
  enlace_publico: string | null;
  enlace_de_imagen: string | null;
  tipo_de_juego: string;
}

export default function HotelBinario({ juego }: { juego: JuegoData }) {
  const [config, setConfig] = useState<any | null>(null);

  useEffect(() => {
    if (juego) {
      setConfig({
        enunciado: juego.enunciado,
        habitaciones: juego.habitaciones,
        tamanioLista: juego.tamanio_lista,
        numeroObjetivo: juego.numero_objetivo,
        numeroDeInicio: juego.numero_de_inicio,
        imagenEnunciado: juego.enlace_de_imagen || undefined,
      });
    }
  }, [juego]);

  if (!config) {
    return <div className="text-center text-white p-4">Cargando juego...</div>;
  }

  return (
    <GameInterface config={config} onBack={() => window.history.back()} />
  );
}


import { useState, useEffect } from "react";
import { getJuego } from "../app/juego/[id]/[tipo_de_juego]/page";

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

export function useJuego(id: string, tipo_de_juego: string) {
  const [juego, setJuego] = useState<JuegoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJuego(id, tipo_de_juego)
      .then(setJuego)
      .catch(() => setError("No se pudo cargar el juego"));
  }, [id, tipo_de_juego]);

  return { juego, error };
}


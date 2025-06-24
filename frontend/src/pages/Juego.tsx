// src/pages/Juego.tsx
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../lib/api";

function Juego() {
  const { id, tipo_de_juego } = useParams();

console.log("hola estoy dentro de juego")
  useEffect(() => {
    if (!id || !tipo_de_juego) return;

    const fetchJuego = async () => {
      try {
        const response = await api.get(`/juego/${id}/${tipo_de_juego}`);
        console.log("JSON recibido:", response.data);
      } catch (error) {
        console.error("Error al obtener el juego:", error);
      }
    };

    fetchJuego();
  }, [id, tipo_de_juego]);

  return (
    <div>
      <h1>Juego dinámico</h1>
      <p>ID: {id}</p>
      <p>Tipo de juego: {tipo_de_juego}</p>
    </div>
  );
}

export default Juego;


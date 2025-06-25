import { Router } from 'express';
import { getUltimoJuego } from '../controllers/juegoController';

const juego: Router = Router();

juego.get('/:id/:tipo_de_juego', getUltimoJuego);

export default juego;


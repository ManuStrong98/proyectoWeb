import { Router } from 'express';
import { insertJuego, getUltimoJuego } from '../controllers/juegoController';

const juegoRoutesV1: Router = Router();

juegoRoutesV1.post('/:id', insertJuego);
juegoRoutesV1.get('/ultimo/:id/:tipo_de_juego', getUltimoJuego);

export default juegoRoutesV1;

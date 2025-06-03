import { Router } from 'express';
import { insertJuego, getUltimoJuego } from '../controllers/juegoController';

const router = Router();

router.post('/', insertJuego);
router.get('/ultimo', getUltimoJuego);

export default router;
import { Router, Request, Response } from 'express';

const authJuego = Router();

authJuego.post('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong', user: req.user });
});

export default authJuego;


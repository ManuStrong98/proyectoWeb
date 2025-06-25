import { Router, Request, Response } from 'express';

const ping = Router();

ping.post('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong', user: req.user });
});

export default ping;


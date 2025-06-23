import express from 'express';
import passport from './config/passport'
import juegoRoutesV1 from './routes/juegoRoutesV1';
import authRoutes from './routes/login'
import ping from './routes/juego'

const app = express();

app.use(express.json());
app.use('/v1', authRoutes);
app.use('/auth',
	passport.authenticate('jwt', { session: false }), ping);

app.use('/auth/v1/juegos', 
	passport.authenticate('jwt', { session: false }), juegoRoutesV1);

export default app;

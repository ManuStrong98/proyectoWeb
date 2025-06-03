import express from 'express';
import juegoRoutesV1 from './routes/juegoRoutesV1';

const app = express();

app.use(express.json());
app.use('/api/v1/juegos', juegoRoutesV1);

export default app;
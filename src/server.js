import express from 'express';
import cors from 'cors';
import productsRouter from './routes/songs.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/songs', productsRouter);

app.listen(process.env.APP_PORT || 3000);
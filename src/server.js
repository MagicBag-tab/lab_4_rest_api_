import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import songsRouter from './routes/songs.js';

dotenv.config();

const app  = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors({
  origin: '*',         
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors());

app.use(express.json());
app.use('/songs', songsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
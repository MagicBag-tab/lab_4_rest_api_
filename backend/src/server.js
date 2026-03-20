import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/products', productsRouter);

app.listen(process.env.APP_PORT || 3000);
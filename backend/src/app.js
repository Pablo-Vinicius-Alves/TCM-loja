import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { notFound, handleErrors } from './middlewares/erros.js';
import produtoRoutes from './routes/produtoRoutes.js';
import authRoutes from './routes/authRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use('/api', routes);

app.use('/api/auth', authRoutes);

app.use('/api/produtos', produtoRoutes);

app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.use(notFound);
app.use(handleErrors);

export default app;
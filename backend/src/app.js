import 'dotenv/config';
import express from 'express';
import connectionDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.get('/api/health', async (req, res) => {
    try {
        const [lines] = await connectionDB.query('SELECT COUNT(*) AS total FROM cliente');
        res.json({ status: 'ok', clientes: lines[0].total });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

app.listen((PORT), () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
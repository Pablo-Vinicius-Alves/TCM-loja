import 'dotenv/config';
import express from 'express';
import connectionDB from './config/db.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/')

app.listen((PORT), () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
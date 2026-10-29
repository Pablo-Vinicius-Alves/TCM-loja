import mysql from 'mysql2/promise';
import 'dotenv/config';

function connectionDB() {
    const con = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
    });
    return con;
}

export default connectionDB;
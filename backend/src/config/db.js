import mysql from 'mysql2/promise';
import { env } from './env.js';

const connectionDB = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database
});

export default connectionDB;
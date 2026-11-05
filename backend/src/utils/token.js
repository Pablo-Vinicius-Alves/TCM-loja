import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
 
export const NOME_COOKIE = 'token';
 
export function assinarToken({ id_cliente, usuario }) {
  return jwt.sign({ usuario }, env.jwt.secret, {
    algorithm: 'HS256',
    subject: String(id_cliente),
    expiresIn: `${env.jwt.expiraEmHoras}h`
  });
}

export function verificarToken(token) {
  return jwt.verify(token, env.jwt.secret, { algorithms: ['HS256'] });
}
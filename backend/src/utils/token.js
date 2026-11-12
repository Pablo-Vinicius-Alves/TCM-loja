import jwt from 'jsonwebtoken';
import {env} from '../config/env.js';
 
export const NOME_COOKIE = 'token';

const MS_POR_HORA = 60 * 60 * 1000;

export const opcoesCookie = {
  httpOnly: true,            
  sameSite: 'lax',  
  secure: env.producao,
  path: '/',
  maxAge: env.jwt.expiraEmHoras * MS_POR_HORA
};
const { maxAge: _ignorado, ...semMaxAge } = opcoesCookie;
export const opcoesLimparCookie = semMaxAge;
 
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
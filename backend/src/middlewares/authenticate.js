import { AppError } from '../utils/AppError.js';
import { NOME_COOKIE, verificarToken } from '../utils/token.js';
 
export function autenticar(req, res, next) {
  const token = req.cookies?.[NOME_COOKIE];
  if (!token) return next(new AppError('Faça login para continuar', 401));
 
  try {
    const payload = verificarToken(token);
    req.usuario = { id_cliente: Number(payload.sub), usuario: payload.usuario };
    next();
  } catch {
    next(new AppError('Sessão expirada. Faça login novamente', 401));
  }
}
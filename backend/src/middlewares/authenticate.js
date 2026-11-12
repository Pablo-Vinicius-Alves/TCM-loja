// Linhas 1 e 2: Importam a classe de erro customizada (AppError) e as funções/constantes utilitárias para manipulação do JWT
import { AppError } from '../utils/AppError.js';
import { NOME_COOKIE, verificarToken } from '../utils/token.js';
 // Linha 4: Exporta uma função de middleware padrão do Express chamada 'autenticar' para proteger as rotas
export function autenticar(req, res, next) {
  const token = req.cookies?.[NOME_COOKIE];
    // Linha 6: Se o token não existir, interrompe o fluxo e envia um erro 401 (Não Autorizado) para o middleware de erro global
  if (!token) return next(new AppError('Faça login para continuar', 401));
 
  try {
    const payload = verificarToken(token);
    req.usuario = { id_cliente: Number(payload.sub), usuario: payload.usuario };
    next();
  } catch {
    next(new AppError('Sessão expirada. Faça login novamente', 401));
  }
}
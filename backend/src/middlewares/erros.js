import AppError from '../utils/AppError.js';

export function notFound(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada.' });
}

export function handleErrors(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ erro: 'Registro duplicado.' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ erro: 'Referência inválida (registro relacionado não existe).' });
  }

  console.error(err); 
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}
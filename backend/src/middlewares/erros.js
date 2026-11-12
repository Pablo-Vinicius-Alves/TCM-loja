import { AppError } from '../utils/appError.js';

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
    let mensagem = 'Registro duplicado.';

    if (err.sqlMessage.includes('cpf')) {
      mensagem = 'Este CPF já está cadastrado.';
    } else if (err.sqlMessage.includes('email')) {
      mensagem = 'Este e-mail já está cadastrado.';
    } else if (err.sqlMessage.includes('usuario')) {
      mensagem = 'Este nome de usuário já está em uso.';
    }
    return res.status(409).json({ erro: mensagem });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ erro: 'Referência inválida (registro relacionado não existe).' });
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}
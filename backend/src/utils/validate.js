import { AppError } from './appError.js';
import { validarCPF } from './cpf.js';
 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USUARIO_REGEX = /^[a-z0-9._-]{3,50}$/;
 
function lerPessoa(body, erros) {
  const nome = String(body.nome ?? '').trim();
  const email = String(body.email ?? '').trim();
  const cpf = validarCPF(body.cpf);
  const telefone = String(body.telefone ?? '').trim() || null;
  const endereco = String(body.endereco ?? '').trim() || null;
 
  if (!nome) erros.push('nome é obrigatório');
  else if (nome.length > 100) erros.push('nome deve ter no máximo 100 caracteres');
 
  if (!email) erros.push('email é obrigatório');
  else if (!EMAIL_REGEX.test(email)) erros.push('email inválido');
  else if (email.length > 120) erros.push('email deve ter no máximo 120 caracteres');
 
  if (!cpf) erros.push('cpf é obrigatório');
  else if (!cpfValido(cpf)) erros.push('cpf inválido');
 
  if (telefone && telefone.length > 20) erros.push('telefone deve ter no máximo 20 caracteres');
  if (endereco && endereco.length > 200) erros.push('endereco deve ter no máximo 200 caracteres');
 
  return { nome, email, cpf, telefone, endereco };
}
 
export function lerRegistro(body = {}) {
  const erros = [];
  const cliente = lerPessoa(body, erros);
 
  const usuario = String(body.usuario ?? '').trim().toLowerCase();
  if (!usuario) erros.push('usuario é obrigatório');
  else if (!USUARIO_REGEX.test(usuario)) {
    erros.push('usuario deve ter de 3 a 50 caracteres: letras, números, ponto, hífen ou sublinhado');
  }
 
  const senha = String(body.senha ?? '');
  if (!senha) erros.push('senha é obrigatória');
  else {
    if (senha.length < 8) erros.push('senha deve ter pelo menos 8 caracteres');
    if (Buffer.byteLength(senha, 'utf8') > 72) erros.push('senha deve ter no máximo 72 caracteres');
    if (!/[a-zA-Z]/.test(senha) || !/\d/.test(senha)) erros.push('senha deve ter letras e números');
  }
 
  if (erros.length) throw new AppError('Dados inválidos', 400, erros);
 
  return { cliente, usuario, senha };
}
 
export function lerLogin(body = {}) {
  const usuario = String(body.usuario ?? '').trim().toLowerCase();
  const senha = String(body.senha ?? '');
 
  if (!usuario || !senha) throw new AppError('Informe usuário e senha', 400);
 
  return { usuario, senha };
}
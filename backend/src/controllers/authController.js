import bcrypt from 'bcryptjs';
import * as Auth from '../models/authModel.js';
import { AppError } from '../utils/AppError.js';
import { lerRegistro, lerLogin } from '../utils/validacoes.js';
import {
  assinarToken,
  NOME_COOKIE,
  opcoesCookie,
  opcoesLimparCookie
} from '../utils/token.js';
 
const CUSTO_BCRYPT = 10;

const MAX_FALHAS = 5;
const JANELA_MINUTOS = 15;
 
const HASH_FALSO = bcrypt.hashSync('hash-falso-para-igualar-o-tempo', CUSTO_BCRYPT);
 
function detectarNavegador(userAgent = '') {
  if (/Edg\//.test(userAgent)) return 'Edge';
  if (/OPR\//.test(userAgent)) return 'Opera';
  if (/Chrome\//.test(userAgent)) return 'Chrome';
  if (/Firefox\//.test(userAgent)) return 'Firefox';
  if (/Safari\//.test(userAgent)) return 'Safari';
  return 'Outro';
}

export async function registrar(req, res) {
  const { cliente, usuario, senha } = lerRegistro(req.body);
 
  const senhaHash = await bcrypt.hash(senha, CUSTO_BCRYPT);
  await Auth.criarConta(cliente, usuario, senhaHash);
 
  res.status(201).json({ mensagem: 'Conta criada com sucesso. Faça login para entrar.' });
}
 
export async function login(req, res) {
  const { usuario, senha } = lerLogin(req.body);
 
  const cadastro = await Auth.buscarCadastroPorUsuario(usuario);
 
  if (!cadastro) {
    await bcrypt.compare(senha, HASH_FALSO);
    throw new AppError('Usuário ou senha inválidos', 401);
  }
 
  const tentativa = {
    idCliente: cadastro.id_cliente,
    ip: req.ip,
    navegador: detectarNavegador(req.get('user-agent'))
  };
 
  const falhas = await Auth.contarFalhasRecentes(cadastro.id_cliente, JANELA_MINUTOS);
  if (falhas >= MAX_FALHAS) {
    throw new AppError(
      `Muitas tentativas incorretas. Tente novamente em ${JANELA_MINUTOS} minutos.`,
      429
    );
  }
 
  const senhaConfere = await bcrypt.compare(senha, cadastro.senha_hash);
  if (!senhaConfere) {
    await Auth.registrarTentativa({ ...tentativa, sucesso: false });
    throw new AppError('Usuário ou senha inválidos', 401);
  }

  if (!cadastro.ativo) {
    await Auth.registrarTentativa({ ...tentativa, sucesso: false });
    throw new AppError('Esta conta está inativa. Procure o suporte da loja.', 403);
  }
 
  await Auth.registrarTentativa({ ...tentativa, sucesso: true });
 
  const token = assinarToken({ id_cliente: cadastro.id_cliente, usuario: cadastro.usuario });
  res.cookie(NOME_COOKIE, token, opcoesCookie);
  res.json({
    cliente: { id_cliente: cadastro.id_cliente, nome: cadastro.nome, usuario: cadastro.usuario }
  });
}
 
export async function logout(req, res) {
  res.clearCookie(NOME_COOKIE, opcoesLimparCookie);
  res.status(204).send();
}
 
export async function perfil(req, res) {
  const dados = await Auth.buscarPerfil(req.usuario.usuario);
  if (!dados) throw new AppError('Sessão inválida. Faça login novamente', 401);
  res.json(dados);
}
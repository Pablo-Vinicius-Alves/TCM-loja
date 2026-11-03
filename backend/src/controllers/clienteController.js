import * as Cliente from '../models/clienteModel.js';
import AppError from '../utils/AppError.js';
import { validarCPF } from '../utils/cpf.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function lerId(valor) {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('id inválido', 400);
  return n;
}

function lerDadosCliente(body = {}) {
  const nome = String(body.nome ?? '').trim();
  const email = String(body.email ?? '').trim();
  const cpf = validarCPF(body.cpf);
  const telefone = String(body.telefone ?? '').trim() || null;
  const endereco = String(body.endereco ?? '').trim() || null;

  const erros = [];

  if (!nome) erros.push('nome é obrigatório');
  else if (nome.length > 100) erros.push('nome deve ter no máximo 100 caracteres');

  if (!email) erros.push('email é obrigatório');
  else if (!EMAIL_REGEX.test(email)) erros.push('email inválido');
  else if (email.length > 120) erros.push('email deve ter no máximo 120 caracteres');

  if (!cpf) erros.push('cpf é obrigatório');
  else if (!validarCPF(cpf)) erros.push('cpf inválido');

  if (telefone && telefone.length > 20) erros.push('telefone deve ter no máximo 20 caracteres');
  if (endereco && endereco.length > 200) erros.push('endereco deve ter no máximo 200 caracteres');

  if (erros.length) throw new AppError('Dados inválidos', 400, erros);

  return { nome, email, cpf, telefone, endereco };
}

async function exigirCliente(id) {
  const cliente = await Cliente.buscarPorId(id);
  if (!cliente) throw new AppError('Cliente não encontrado', 404);
  return cliente;
}

export async function listarClientes(req, res) {
  res.json(await Cliente.listar());
}

export async function buscarCliente(req, res) {
  const id = lerId(req.params.id);
  res.json(await exigirCliente(id));
}

export async function criarCliente(req, res) {
  const dados = lerDadosCliente(req.body);
  const novoId = await Cliente.criar(dados);
  res.status(201).json(await Cliente.buscarPorId(novoId));
}

export async function atualizarCliente(req, res) {
  const id = lerId(req.params.id);
  await exigirCliente(id);
  const dados = lerDadosCliente(req.body);
  await Cliente.atualizar(id, dados);
  res.json(await Cliente.buscarPorId(id));
}

export async function removerCliente(req, res) {
  const id = lerId(req.params.id);
  const removidos = await Cliente.remover(id);
  if (!removidos) throw new AppError('Cliente não encontrado', 404);
  res.status(204).send();
}
import * as Carrinho from '../models/carrinhoModel.js';
import { MAX_POR_ITEM } from '../models/carrinhoModel.js';
import { AppError } from '../utils/appError.js';
import { lerInteiroPositivo } from '../utils/params.js';

function lerQuantidade(valor) {
  const texto = typeof valor === 'number' ? String(valor) : valor;
  if (typeof texto !== 'string' || !/^\d{1,3}$/.test(texto) || Number(texto) < 1 || Number(texto) > MAX_POR_ITEM) {
    throw new AppError(`quantidade deve ser um número inteiro de 1 a ${MAX_POR_ITEM}`, 400);
  }
  return Number(texto);
}

export async function obter(req, res) {
  res.json(await Carrinho.obter(req.usuario.id_cliente));
}

export async function adicionar(req, res) {
  const { id_produto, quantidade = 1 } = req.body ?? {};
  const idProduto = lerInteiroPositivo(
    typeof id_produto === 'number' ? String(id_produto) : id_produto,
    'id_produto'
  );
  const carrinho = await Carrinho.adicionar(req.usuario.id_cliente, idProduto, lerQuantidade(quantidade));
  res.status(201).json(carrinho);
}

export async function alterarQuantidade(req, res) {
  const idProduto = lerInteiroPositivo(req.params.idProduto, 'id_produto');
  const quantidade = lerQuantidade((req.body ?? {}).quantidade);
  res.json(await Carrinho.definirQuantidade(req.usuario.id_cliente, idProduto, quantidade));
}

export async function removerItem(req, res) {
  const idProduto = lerInteiroPositivo(req.params.idProduto, 'id_produto');
  res.json(await Carrinho.removerItem(req.usuario.id_cliente, idProduto));
}

export async function esvaziar(req, res) {
  res.json(await Carrinho.esvaziar(req.usuario.id_cliente));
}

export async function finalizar(req, res) {
  const resultado = await Carrinho.finalizar(req.usuario.id_cliente, req.body?.cupom);
  res.status(201).json(resultado);
}

export async function obterNotaFiscal(req, res) {
  const idNf = lerInteiroPositivo(req.params.idNotaFiscal, 'id_nota_fiscal');
  const nota = await Carrinho.obterNotaFiscal(req.usuario.id_cliente, idNf);
  res.json(nota);
}

export async function listarPedidos(req, res) {
  res.json(await Carrinho.listarPedidos(req.usuario.id_cliente));
}

export async function validarCupom(req, res) {
  const carrinho = await Carrinho.obter(req.usuario.id_cliente);
  if (carrinho.itens.length === 0) {
    throw new AppError('Adicione itens ao carrinho antes de aplicar um cupom.', 400);
  }
  const resultado = Carrinho.calcularDescontoCupom(req.body?.cupom, carrinho.total);
  res.json(resultado);
}


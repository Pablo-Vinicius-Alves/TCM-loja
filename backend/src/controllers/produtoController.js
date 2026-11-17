import * as Produto from '../models/produtoModel.js';

export async function listar(req, res) {
  const produtos = await Produto.listarTodos();
  res.json(produtos);
}
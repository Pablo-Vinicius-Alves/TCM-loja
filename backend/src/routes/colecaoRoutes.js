import * as Colecao from '../models/colecaoModel.js';

export async function listarColecoes(req, res) {
  res.json(await Colecao.listar());
}
import { api, ApiError } from './api.js';
import { mostrarAlerta } from './ui.js';

export const obterCarrinho = () => api('/carrinho');

export const adicionarAoCarrinho = (idProduto, quantidade = 1) =>
  api('/carrinho/itens', { method: 'POST', body: { id_produto: idProduto, quantidade } });

export const alterarQuantidade = (idProduto, quantidade) =>
  api(`/carrinho/itens/${idProduto}`, { method: 'PATCH', body: { quantidade } });

export const removerDoCarrinho = (idProduto) =>
  api(`/carrinho/itens/${idProduto}`, { method: 'DELETE' });

export const esvaziarCarrinho = () => api('/carrinho', { method: 'DELETE' });

export function mostrarContagem(carrinho) {
  const alvo = document.getElementById('contagem-carrinho');
  if (alvo) alvo.textContent = String(carrinho?.quantidade_total ?? 0);
}

export async function atualizarContagem() {
  try {
    mostrarContagem(await api('/carrinho', { redirecionar401: false }));
  } catch (erro) {
    if (!(erro instanceof ApiError)) throw erro;
    mostrarContagem(null);
  }
}

export async function aoClicarAdicionar(botao, areaDeAviso) {
  botao.disabled = true;
  try {
    mostrarContagem(await adicionarAoCarrinho(Number(botao.dataset.idProduto)));
  } catch (erro) {
    if (!(erro instanceof ApiError)) throw erro;
    if (areaDeAviso) mostrarAlerta(areaDeAviso, erro.message);
  } finally {
    botao.disabled = false;
  }
}
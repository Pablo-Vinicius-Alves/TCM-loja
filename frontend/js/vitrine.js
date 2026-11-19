import { ErroApi, listarProdutos } from './loja.js';
import { iniciarSessao, mostrarContador } from './sessao.js';
import { criarCartao, ligarCompra } from './UI.js';

const QUANTIDADE_NA_VITRINE = 6;

const grade = document.getElementById('grade-produtos');
const aviso = document.getElementById('aviso-vitrine');

const usuario = await iniciarSessao();
ligarCompra({ container: grade, usuario, aviso, aoAdicionar: mostrarContador });

try {
  const produtos = await listarProdutos({ limite: QUANTIDADE_NA_VITRINE });
  if (produtos.length === 0) {
    aviso.textContent = 'Nenhum produto disponível no momento.';
    aviso.hidden = false;
  } else {
    grade.replaceChildren(...produtos.map(criarCartao));
  }
} catch (erro) {
  if (!(erro instanceof ErroApi)) throw erro;
  aviso.textContent = `Não foi possível carregar os produtos. ${erro.message}`;
  aviso.hidden = false;
}
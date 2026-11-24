import { ErroApi, listarColecoes, listarProdutos } from './loja.js';
import { iniciarSessao, mostrarContador } from './sessao.js';
import { criarCartao, ligarCompra, ligarModalDetalhes } from './UI.js';

const lista = document.getElementById('lista-colecoes');
const aviso = document.getElementById('aviso-colecoes');
const campoBusca = document.getElementById('campo-busca');
let vitrineCompleta = [];

const abrirModal = ligarModalDetalhes();

function criarSecao(colecao, produtos) {
  const secao = document.createElement('section');
  secao.className = 'secao-vitrine';

  const titulo = document.createElement('h2');
  titulo.className = 'titulo-secao';
  titulo.textContent = colecao.nome;
  secao.append(titulo);

  if (colecao.descricao) {
    const subtitulo = document.createElement('p');
    subtitulo.className = 'subtitulo-secao';
    subtitulo.textContent = colecao.descricao;
    secao.append(subtitulo);
  }

  const grade = document.createElement('div');
  grade.className = 'grade-produtos';
  grade.append(...produtos.map((p) => criarCartao(p, abrirModal)));
  secao.append(grade);
  return secao;
}

const usuario = await iniciarSessao();
ligarCompra({ container: document.body, usuario, aviso, aoAdicionar: mostrarContador });

try {
  const colecoes = (await listarColecoes()).filter((c) => c.total_produtos > 0);
  if (colecoes.length === 0) {
    aviso.textContent = 'Nenhuma coleção disponível no momento.';
    aviso.hidden = false;
  } else {
    const produtos = await Promise.all(colecoes.map((c) => listarProdutos({ colecao: c.id_colecao })));
    vitrineCompleta = colecoes.map((c, i) => ({ colecao: c, produtos: produtos[i] }));
    renderizarBusca();
  }
} catch (erro) {
  if (!(erro instanceof ErroApi)) throw erro;
  aviso.textContent = `Não foi possível carregar as coleções. ${erro.message}`;
  aviso.hidden = false;
}

function renderizarBusca(termo = '') {
  const busca = termo.trim().toLowerCase();

  const secoesFiltradas = vitrineCompleta
    .map(({ colecao, produtos }) => ({
      colecao,
      produtos: produtos.filter((p) => p.nome.toLowerCase().includes(busca))
    }))
    .filter((item) => item.produtos.length > 0);

  if (secoesFiltradas.length === 0) {
    aviso.textContent = 'Nenhum produto encontrado';
    aviso.hidden = false;
    lista.replaceChildren();
    return;
  }

  aviso.hidden = true;
  lista.replaceChildren(...secoesFiltradas.map((item) => criarSecao(item.colecao, item.produtos)));
}

campoBusca.addEventListener('input', () => renderizarBusca(campoBusca.value));
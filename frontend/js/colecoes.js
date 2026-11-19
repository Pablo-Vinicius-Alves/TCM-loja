import { ErroApi, listarColecoes, listarProdutos } from './loja.js';
import { iniciarSessao, mostrarContador } from './sessao.js';
import { criarCartao, ligarCompra } from './UI.js';

const lista = document.getElementById('lista-colecoes');
const aviso = document.getElementById('aviso-colecoes');

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
  grade.append(...produtos.map(criarCartao));
  secao.append(grade);
  return secao;
}

const usuario = await iniciarSessao();
ligarCompra({ container: lista, usuario, aviso, aoAdicionar: mostrarContador });

try {
  const colecoes = (await listarColecoes()).filter((c) => c.total_produtos > 0);
  if (colecoes.length === 0) {
    aviso.textContent = 'Nenhuma coleção disponível no momento.';
    aviso.hidden = false;
  } else {
    const produtos = await Promise.all(colecoes.map((c) => listarProdutos({ colecao: c.id_colecao })));
    lista.replaceChildren(...colecoes.map((c, i) => criarSecao(c, produtos[i])));
  }
} catch (erro) {
  if (!(erro instanceof ErroApi)) throw erro;
  aviso.textContent = `Não foi possível carregar as coleções. ${erro.message}`;
  aviso.hidden = false;
}
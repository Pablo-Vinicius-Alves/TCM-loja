import {
  MAX_POR_ITEM, ErroApi, formatarPreco, irParaLogin,
  obterCarrinho, alterarQuantidade, removerDoCarrinho, esvaziarCarrinho, finalizarCompra
} from './loja.js';
import { iniciarSessao, mostrarContador } from './sessao.js';

const $ = (id) => document.getElementById(id);
const corpo = $('itens-carrinho');
const total = $('total-carrinho');
const aviso = $('aviso-carrinho');
const btnEsvaziar = $('btn-esvaziar');
const btnFinalizar = $('btn-finalizar');
let ocupado = false;

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function celula(...filhos) {
  const td = el('td');
  td.append(...filhos);
  return td;
}

function botao(acao, texto, rotulo, desativado = false) {
  const b = el('button', `btn-${acao}`, texto);
  b.type = 'button';
  b.dataset.acao = acao;
  b.setAttribute('aria-label', rotulo);
  b.disabled = desativado;
  return b;
}

function criarLinha(item) {
  const linha = el('tr');
  linha.dataset.idProduto = item.id_produto;
  linha.dataset.quantidade = item.quantidade;
  if (!item.disponivel) linha.classList.add('item-indisponivel');

  const foto = el('div', 'carrinho-foto');
  if (item.imagem) {
    const img = el('img');
    img.src = item.imagem;
    img.alt = item.nome;
    foto.append(img);
  }
  const nome = el('div', 'carrinho-nome', item.nome);
  const produto = el('div', 'carrinho-produto');
  produto.append(foto, nome);
  if (!item.disponivel) {
    nome.append(el('div', 'carrinho-alerta-item', 'Indisponível no momento: reduza a quantidade ou remova.'));
  }

  const limite = Math.min(MAX_POR_ITEM, item.estoque);
  const qtd = el('div', 'carrinho-qtd');
  qtd.append(
    botao('menos', '−', `Diminuir a quantidade de ${item.nome}`, item.quantidade <= 1),
    el('span', 'carrinho-numero', String(item.quantidade)),
    botao('mais', '+', `Aumentar a quantidade de ${item.nome}`, item.quantidade >= limite)
  );

  linha.append(
    celula(produto),
    celula(document.createTextNode(formatarPreco(item.preco_unitario))),
    celula(qtd),
    celula(document.createTextNode(formatarPreco(item.subtotal))),
    celula(botao('remover', '×', `Remover ${item.nome} do carrinho`))
  );
  return linha;
}

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.hidden = !texto;
}

function mostrar(carrinho) {
  if (carrinho.itens.length === 0) {
    const vazio = el('td', 'carrinho-vazio', 'Seu carrinho está vazio.');
    vazio.colSpan = 5;
    const linha = el('tr');
    linha.append(vazio);
    corpo.replaceChildren(linha);
  } else {
    corpo.replaceChildren(...carrinho.itens.map(criarLinha));
  }

  const temIndisponivel = carrinho.itens.some((i) => !i.disponivel);
  total.textContent = formatarPreco(carrinho.total);
  btnEsvaziar.disabled = carrinho.itens.length === 0;
  btnFinalizar.disabled = carrinho.itens.length === 0 || temIndisponivel;
  btnFinalizar.title = temIndisponivel ? 'Remova ou ajuste os itens indisponíveis' : '';

  mostrarAviso('');
  mostrarContador(carrinho);
}

async function executar(pedido) {
  if (ocupado) return;
  ocupado = true;
  corpo.setAttribute('aria-busy', 'true');
  try {
    mostrar(await pedido());
  } catch (erro) {
    if (!(erro instanceof ErroApi)) throw erro;
    if (erro.status === 401) return irParaLogin();
    mostrarAviso(erro.message);
  } finally {
    ocupado = false;
    corpo.removeAttribute('aria-busy');
  }
}

corpo.addEventListener('click', (evento) => {
  const clicado = evento.target.closest('button[data-acao]');
  const linha = clicado?.closest('tr[data-id-produto]');
  if (!clicado || !linha || clicado.disabled) return;

  const id = Number(linha.dataset.idProduto);
  const quantidade = Number(linha.dataset.quantidade);
  if (clicado.dataset.acao === 'mais') executar(() => alterarQuantidade(id, quantidade + 1));
  if (clicado.dataset.acao === 'menos') executar(() => alterarQuantidade(id, quantidade - 1));
  if (clicado.dataset.acao === 'remover') executar(() => removerDoCarrinho(id));
});

btnEsvaziar.addEventListener('click', () => {
  if (window.confirm('Remover todos os itens do carrinho?')) executar(esvaziarCarrinho);
});

btnFinalizar.addEventListener('click', async () => {
  if (ocupado || btnFinalizar.disabled) return;
  if (!window.confirm('Deseja finalizar a compra e emitir a Nota Fiscal?')) return;

  ocupado = true;
  btnFinalizar.disabled = true;
  btnFinalizar.textContent = 'Processando...';
  try {
    const nf = await finalizarCompra();
    window.location.assign(`/pages/nota-fiscal.html?id=${nf.id_nota_fiscal}`);
  } catch (erro) {
    btnFinalizar.textContent = 'Finalizar Compra';
    btnFinalizar.disabled = false;
    if (!(erro instanceof ErroApi)) throw erro;
    if (erro.status === 401) return irParaLogin();
    mostrarAviso(erro.message);
  } finally {
    ocupado = false;
  }
});

const usuario = await iniciarSessao();
if (!usuario) irParaLogin();
else await executar(obterCarrinho);

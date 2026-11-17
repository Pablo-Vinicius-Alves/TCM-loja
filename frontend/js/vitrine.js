import { api } from './api.js';

const $ = (id) => document.getElementById(id);

let usuarioAutenticado = false;
let usuarioDados = null;

async function carregarProdutosDaAPI() {
  try {
    const produtos = await api('/produtos', { redirecionar401: false });
    renderizarProdutos(produtos);
  } catch (erro) {
    console.error('Erro ao carregar produtos da API:', erro);
    const grade = $('grade-produtos');
    if (grade) {
      grade.innerHTML = `<p style="text-align: center; color: var(--perigo);">Erro ao carregar os produtos do sistema.</p>`;
    }
  }
}

async function checarSessao() {
  try {
    usuarioDados = await api('/auth/me', { redirecionar401: false });
    usuarioAutenticado = true;
    localStorage.removeItem('carrinho'); 
    renderizarHeaderUsuario();
  } catch {
    usuarioAutenticado = false;
    renderizarHeaderUsuario();
  }
}

function renderizarHeaderUsuario() {
  const container = $('usuario-container');
  if (!container) return;
  
  if (usuarioAutenticado) {
    container.innerHTML = `<span>Olá, <strong>${usuarioDados.nome || 'Cliente'}</strong></span>`;
  } else {
    container.innerHTML = `<a href="index.html" class="btn btn--secundario">Entrar</a>`;
  }
}

function renderizarProdutos(produtos) {
  const grade = $('grade-produtos');
  if (!grade) return;

  if (!produtos || produtos.length === 0) {
    grade.innerHTML = `<p style="text-align: center;">Nenhum produto cadastrado no momento.</p>`;
    return;
  }

  grade.innerHTML = produtos.map(p => `
    <div class="card-produto">
      <div class="card-produto__imagem-container">
        <img 
          src="../assets/produtos/${p.imagem || 'default.jpg'}" 
          alt="${p.nome}"
          onerror="this.onerror=null; this.src='../assets/products/images.jpg';"
        >
      </div>
      <h3 class="card-produto__titulo">${p.nome}</h3>
      <p class="card-produto__preco">R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</p>
      <button class="btn btn--primario btn-adicionar" data-id="${p.id_produto}">
        Adicionar ao Carrinho
      </button>
    </div>
  `).join('');
}

async function adicionarAoCarrinhoAPI(produtoId, botao) {
  botao.disabled = true;
  const textoOriginal = botao.textContent;
  
  try {
    const resposta = await api('/carrinho/itens', { 
      method: 'POST', 
      body: { id_produto: Number(produtoId), quantidade: 1 } 
    });

    botao.textContent = '✓ Adicionado!';
    botao.style.backgroundColor = '#16a34a';

    const contadorEl = $('carrinho-contador');
    if (contadorEl && resposta) {
      contadorEl.textContent = resposta.quantidade_total || 0;
    }
  } catch (erro) {
    console.error('Erro ao adicionar:', erro);
    alert('Erro ao adicionar produto ao carrinho. Faça login novamente.');
  } finally {
    setTimeout(() => {
      botao.textContent = textoOriginal;
      botao.style.backgroundColor = '';
      botao.disabled = false;
    }, 1000);
  }
}

const grade = $('grade-produtos');
if (grade) {
  grade.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.btn-adicionar');
    if (botao) {
      evento.preventDefault();
      evento.stopPropagation();
      const produtoId = botao.dataset.id;
      adicionarAoCarrinhoAPI(produtoId, botao);
    }
  });
}

checarSessao();
carregarProdutosDaAPI();

const trilho = $('grade-produtos');
const btnPrev = $('btn-prev');
const btnNext = $('btn-next');

if (trilho && btnPrev && btnNext) {
  const LARGURA_CARD = 284;

  btnPrev.addEventListener('click', () => {
    trilho.scrollBy({ left: -LARGURA_CARD * 2, behavior: 'smooth' });
  });

  btnNext.addEventListener('click', () => {
    trilho.scrollBy({ left: LARGURA_CARD * 2, behavior: 'smooth' });
  });
}
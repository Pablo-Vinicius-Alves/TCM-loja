import { api } from './api.js';

const $ = (id) => document.getElementById(id);

let usuarioAutenticado = false;
let usuarioDados = null;

const PRODUTOS = [
  {
    id: 1,
    nome: 'Vestido Brilho',
    preco: 159.90,
    imagem: '../assets/produtos/vestido-brilho.jpg'
  },
  {
    id: 2,
    nome: 'Vestido Grande',
    preco: 189.90,
    imagem: '../assets/produtos/vestido-grande.jpg'
  },
  {
    id: 3,
    nome: 'Vestido Ind',
    preco: 139.90,
    imagem: '../assets/produtos/vestido-ind.jpg'
  },
  {
    id: 4,
    nome: 'Look Temo',
    preco: 99.90,
    imagem: '../assets/produtos/terno.jpg'
  }
];

function obterCarrinhoLocal() {
  return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinhoLocal(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
  const carrinho = obterCarrinhoLocal();
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const contadorEl = $('carrinho-contador');
  if (contadorEl) contadorEl.textContent = totalItens;
}

async function checarSessao() {
  try {
    usuarioDados = await api('/auth/me', { redirecionar401: false });
    usuarioAutenticado = true;
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
    container.innerHTML = `<a href="/pages/login.html" class="btn btn--secundario">Entrar</a>`;
  }
}

function renderizarProdutos() {
  const grade = $('grade-produtos');
  if (!grade) return;

  grade.innerHTML = PRODUTOS.map(p => `
    <div class="card-produto">
      <div class="card-produto__imagem-container">
        <img 
          src="${p.imagem}" 
          alt="${p.nome}"
          onerror="this.onerror=null; this.src='../assets/products/images.jpg';"
        >
      </div>
      <h3 class="card-produto__titulo">${p.nome}</h3>
      <p class="card-produto__preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
      <button class="btn btn--primario btn-adicionar" data-id="${p.id}">
        Adicionar ao Carrinho
      </button>
    </div>
  `).join('');
}

function adicionarAoCarrinho(produtoId) {
  const carrinho = obterCarrinhoLocal();
  const id = String(produtoId);
  const itemExistente = carrinho.find(item => String(item.produtoId) === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ produtoId: id, quantidade: 1 });
  }

  salvarCarrinhoLocal(carrinho);
}

async function finalizarCompra() {
  const carrinho = obterCarrinhoLocal();
  
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  try {
    await api('/auth/me', { redirecionar401: false });
    usuarioAutenticado = true;
  } catch {
    usuarioAutenticado = false;
  }

  if (!usuarioAutenticado) {
    sessionStorage.setItem('redirecionar_checkout', 'true');
    window.location.href = '/pages/login.html';
    return;
  }

  window.location.href = '/pages/checkout.html';
}

const grade = $('grade-produtos');
if (grade) {
  grade.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.btn-adicionar');
    
    if (botao) {
      evento.preventDefault();
      evento.stopPropagation();

      const produtoId = botao.dataset.id;
      botao.disabled = true;
      
      adicionarAoCarrinho(produtoId);

      const textoOriginal = botao.textContent;
      botao.textContent = '✓ Adicionado!';
      botao.style.backgroundColor = '#28a745';

      setTimeout(() => {
        botao.textContent = textoOriginal;
        botao.style.backgroundColor = '';
        botao.disabled = false;
      }, 1000);
    }
  });
}

$('btn-finalizar-compra')?.addEventListener('click', finalizarCompra);
$('modal-fechar')?.addEventListener('click', () => $('modal-auth')?.close());

checarSessao();
renderizarProdutos();
atualizarContadorCarrinho();
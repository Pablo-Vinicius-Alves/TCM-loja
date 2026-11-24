import { 
  ErroApi, 
  formatarPreco, 
  irParaLogin, 
  adicionarAoCarrinho } from './loja.js';

export function criarCartao(produto, aoAbrirDetalhes) {
  const cartao = document.createElement('div');
  cartao.className = 'cartao-produto';

  const moldura = document.createElement('div');
  moldura.className = 'moldura-foto';
  if (produto.imagem) {
    const foto = document.createElement('img');
    foto.src = produto.imagem;
    foto.alt = produto.nome;
    foto.loading = 'lazy';
    moldura.append(foto);
  }

  const nome = document.createElement('div');
  nome.className = 'nome-produto';
  nome.textContent = produto.nome;

  if (aoAbrirDetalhes) {
    moldura.style.cursor = 'pointer';
    nome.style.cursor = 'pointer';
    moldura.addEventListener('click', () => aoAbrirDetalhes(produto));
    nome.addEventListener('click', () => aoAbrirDetalhes(produto));
  }

  const preco = document.createElement('div');
  preco.className = 'preco-produto';
  preco.textContent = formatarPreco(produto.preco);

  const botao = document.createElement('button');
  botao.className = 'botao-dourado';
  botao.type = 'button';
  botao.dataset.idProduto = produto.id_produto;
  botao.textContent = produto.estoque > 0 ? 'Adicionar' : 'Esgotado';
  botao.disabled = produto.estoque <= 0;

  cartao.append(moldura, nome, preco, botao);

  if (produto.estoque > 0 && produto.estoque <= 5) {
    const alerta = document.createElement('div');
    alerta.className = 'alerta-estoque';
    alerta.textContent = `Restam apenas ${produto.estoque} unidade(s)!`;
    cartao.append(alerta);
  }
  return cartao;
}

export function ligarModalDetalhes() {
  const modal = document.getElementById('modal-produto');
  if (!modal) return null;

  const img = document.getElementById('modal-imagem');
  const nome = document.getElementById('modal-nome');
  const desc = document.getElementById('modal-descricao');
  const estoque = document.getElementById('modal-estoque');
  const preco = document.getElementById('modal-preco');
  const btnComprar = document.getElementById('modal-btn-comprar');
  const btnFechar = document.getElementById('fechar-modal');

  btnFechar.addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  return (produto) => {
    img.src = produto.imagem || '';
    img.alt = produto.nome;
    nome.textContent = produto.nome;
    desc.textContent = produto.descricao || 'Peça exclusiva da coleção SmartClothes.';
    estoque.textContent = produto.estoque > 0 
      ? `Em estoque: ${produto.estoque} unidade(s)` 
      : 'Produto esgotado';
    preco.textContent = formatarPreco(produto.preco);

    btnComprar.dataset.idProduto = produto.id_produto;
    btnComprar.disabled = produto.estoque <= 0;
    btnComprar.textContent = produto.estoque > 0 ? 'Adicionar ao Carrinho' : 'Esgotado';

    modal.showModal();
  };
}

export function ligarCompra({ container, usuario, aviso, aoAdicionar }) {
  const mostrarAviso = (texto) => { aviso.textContent = texto; aviso.hidden = !texto; };

  container.addEventListener('click', async (evento) => {
    const botao = evento.target.closest('button[data-id-produto]');
    if (!botao || botao.disabled) return;

    if (!usuario) return irParaLogin(); 

    const textoOriginal = botao.textContent;
    botao.disabled = true; 
    try {
      aoAdicionar(await adicionarAoCarrinho(Number(botao.dataset.idProduto)));
      mostrarAviso('');
      botao.textContent = 'Adicionado ✓';
      setTimeout(() => { botao.textContent = textoOriginal; botao.disabled = false; }, 1200);
    } catch (erro) {
      botao.textContent = textoOriginal;
      botao.disabled = false;
      if (!(erro instanceof ErroApi)) throw erro;
      if (erro.status === 401) return irParaLogin();
      mostrarAviso(erro.message);
    }
  });
}
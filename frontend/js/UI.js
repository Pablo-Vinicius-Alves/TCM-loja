import { 
  ErroApi, 
  formatarPreco, 
  irParaLogin, 
  adicionarAoCarrinho } from './loja.js';

export function criarCartao(produto) {
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
  return cartao;
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
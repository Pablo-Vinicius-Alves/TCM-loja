import { ErroApi, obterUsuario, sair, obterCarrinho } from './loja.js';

export function mostrarContador(carrinho) {
  const alvo = document.getElementById('contagem-carrinho');
  if (alvo) alvo.textContent = String(carrinho?.quantidade_total ?? 0);
}

export async function iniciarSessao() {
  const usuario = await obterUsuario();

  const link = document.querySelector('nav a[href$="auth.html"]');
  if (link && usuario) {
    const liPedidos = document.createElement('li');
    const aPedidos = document.createElement('a');
    aPedidos.href = 'pedidos.html';
    aPedidos.textContent = 'Meus Pedidos';
    if (window.location.pathname.endsWith('pedidos.html')) aPedidos.className = 'ativo';
    liPedidos.append(aPedidos);
    link.closest('li')?.before(liPedidos);

    link.textContent = `Sair (${usuario.nome.split(' ')[0]})`;
    link.setAttribute('href', '#');
    link.addEventListener('click', async (evento) => {
      evento.preventDefault();
      await sair().catch(() => {});
      window.location.reload();
    });
  }

  if (usuario) {
    try {
      mostrarContador(await obterCarrinho());
    } catch (erro) {
      if (!(erro instanceof ErroApi)) throw erro;
    }
  }
  return usuario;
}
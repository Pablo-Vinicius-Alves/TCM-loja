export const PAGINA_LOGIN = '/pages/auth.html';
export const PAGINA_INICIAL = '/pages/index.html';

export const MAX_POR_ITEM = 10;

export class ErroApi extends Error {
  constructor(mensagem, status, detalhes = []) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;     
    this.detalhes = detalhes; 
  }
}

async function chamar(caminho, { method = 'GET', body } = {}) {
  let resposta;
  try {
    resposta = await fetch(`/api${caminho}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ErroApi('Não foi possível conectar ao servidor.', 0);
  }
  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) throw new ErroApi(dados?.erro ?? 'Erro inesperado.', resposta.status, dados?.detalhes ?? []);
  return dados;
}

export const irParaLogin = () => window.location.assign(PAGINA_LOGIN);

export const formatarPreco = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const soDigitos = (texto) => String(texto ?? '').replace(/\D/g, '');

export function formatarCpf(texto) {
  const d = soDigitos(texto).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export const entrar = (usuario, senha) => chamar('/auth/login', { method: 'POST', body: { usuario, senha } });
export const registrar = (dados) => chamar('/auth/registrar', { method: 'POST', body: dados });
export const sair = () => chamar('/auth/logout', { method: 'POST' });

export async function obterUsuario() {
  try {
    return await chamar('/auth/perfil');
  } catch (erro) {
    if (erro instanceof ErroApi && erro.status === 401) return null;
    throw erro;
  }
}

export function listarProdutos({ colecao, limite } = {}) {
  const filtros = new URLSearchParams();
  if (colecao) filtros.set('colecao', colecao);
  if (limite) filtros.set('limite', limite);
  const texto = filtros.toString();
  return chamar(`/produtos${texto ? `?${texto}` : ''}`);
}
export const listarColecoes = () => chamar('/colecoes');

export const obterCarrinho = () => chamar('/carrinho');
export const adicionarAoCarrinho = (idProduto, quantidade = 1) =>
  chamar('/carrinho/itens', { method: 'POST', body: { id_produto: idProduto, quantidade } });
export const alterarQuantidade = (idProduto, quantidade) =>
  chamar(`/carrinho/itens/${idProduto}`, { method: 'PATCH', body: { quantidade } });
export const removerDoCarrinho = (idProduto) => chamar(`/carrinho/itens/${idProduto}`, { method: 'DELETE' });
export const esvaziarCarrinho = () => chamar('/carrinho', { method: 'DELETE' });
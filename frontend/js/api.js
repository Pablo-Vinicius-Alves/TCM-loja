export class ErroApi extends Error {
  constructor(mensagem, status, detalhes = []) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.detalhes = detalhes;
  }
}

export async function chamarApi(caminho, { metodo = 'GET', corpo, redirecionar401 = true } = {}) {
  let resposta;

  try {
    resposta = await fetch(`http://localhost:3000/api${caminho}`, {
      method: metodo,
      credentials: 'include',
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined
    });
  } catch {
    throw new ErroApi('Não foi possível conectar ao servidor.', 0);
  }

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    if (resposta.status === 401 && redirecionar401) {
      window.location.replace('login.html');
    }
    throw new ErroApi(dados?.erro ?? 'Erro inesperado.', resposta.status, dados?.detalhes ?? []);
  }

  return dados;
}
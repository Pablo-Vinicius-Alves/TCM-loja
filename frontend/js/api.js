export class ApiError extends Error {
  constructor(mensagem, status, detalhes = []) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status; 
    this.detalhes = detalhes;
  }
}
 
export async function api(caminho, { method = 'GET', body, redirecionar401 = true } = {}) {
  let resposta;
 
  try {
    resposta = await fetch(`/api${caminho}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 0);
  }
 
  if (resposta.status === 204) return null;
 
  const dados = await resposta.json().catch(() => null);
 
  if (!resposta.ok) {
    if (resposta.status === 401 && redirecionar401) window.location.replace('/');
    throw new ApiError(dados?.erro ?? 'Erro inesperado.', resposta.status, dados?.detalhes ?? []);
  }
 
  return dados;
}
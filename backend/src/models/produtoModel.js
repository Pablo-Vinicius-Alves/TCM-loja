import connectionDB from '../config/db.js';

export async function listarTodos() {
  const [linhas] = await connectionDB.query('SELECT * FROM produto WHERE ativo = TRUE');
  return linhas;
}
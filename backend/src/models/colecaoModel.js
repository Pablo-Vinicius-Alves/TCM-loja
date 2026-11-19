import connectionDB from '../config/db.js';

export async function listar() {
  const [linhas] = await connectionDB.query(
    `SELECT c.id_colecao, c.nome, c.descricao,
            COUNT(p.id_produto) AS total_produtos
       FROM colecao c
       LEFT JOIN produto p
              ON p.id_colecao = c.id_colecao AND p.ativo = TRUE
      WHERE c.ativa = TRUE
      GROUP BY c.id_colecao, c.nome, c.descricao
      ORDER BY c.id_colecao`
  );
  return linhas;
}
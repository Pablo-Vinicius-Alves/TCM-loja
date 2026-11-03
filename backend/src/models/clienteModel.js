import db from '../config/db.js';

export async function listar() {
  const [rows] = await db.query('SELECT * FROM cliente ORDER BY id_cliente DESC;');
  return rows;
}

export async function buscarPorId(id) {
  const [rows] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?;', [id]);
  return rows[0] || null;
}

export async function criar({ nome, email, cpf, telefone, endereco }) {
  const query = `
    INSERT INTO cliente (nome, email, cpf, telefone, endereco)
    VALUES (?, ?, ?, ?, ?);
  `;
  const [result] = await db.query(query, [nome, email, cpf, telefone, endereco]);
  return result.insertId;
}

export async function atualizar(id, { nome, email, cpf, telefone, endereco }) {
  const query = `
    UPDATE cliente
    SET nome = ?, email = ?, cpf = ?, telefone = ?, endereco = ?
    WHERE id_cliente = ?;
  `;
  await db.query(query, [nome, email, cpf, telefone, endereco, id]);
}

export async function remover(id) {
  await db.query('DELETE FROM consulta WHERE id_cliente=?', [id]);
  await db.query('DELETE FROM compra WHERE id_cliente=?', [id]);
  await db.query('DELETE FROM venda WHERE id_cliente=?', [id]);
  await db.query('DELETE FROM login WHERE id_cliente=?', [id]);

  const query = 'DELETE FROM cliente WHERE id_cliente=?';
  const [result] = await db.query(query, [id]);

  return result.affectedRows > 0;
}
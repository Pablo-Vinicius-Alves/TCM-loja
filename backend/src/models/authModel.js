import connectionDB from '../config/db.js';

export async function buscarCadastroPorUsuario(usuario) {
  const [linhas] = await connectionDB.query(
    `SELECT ca.id_cadastro, ca.id_cliente, ca.usuario, ca.senha_hash, ca.ativo, c.nome
       FROM cadastro ca
       JOIN cliente c ON c.id_cliente = ca.id_cliente
      WHERE ca.usuario = ?`,
    [usuario]
  );
  return linhas[0] ?? null;
}

export async function contarFalhasRecentes(idCliente, minutos) {
  const [linhas] = await connectionDB.query(
    `SELECT COUNT(*) AS total
       FROM login
      WHERE id_cliente = ?
        AND sucesso = FALSE
        AND id_login > COALESCE(
              (SELECT MAX(id_login) FROM login
                WHERE id_cliente = ? AND sucesso = TRUE),
              0)`,
    [idCliente, minutos, idCliente]
  );
  return Number(linhas[0].total);
}

export async function registrarTentativa({ idCliente, ip, navegador, sucesso }) {
  await connectionDB.query(
    `INSERT INTO login (id_cliente, ip_endereco, navegador, sucesso)
     VALUES (?, ?, ?, ?)`,
    [idCliente, ip, navegador, sucesso]
  );
}

export async function criarConta(cliente, usuario, senhaHash) {
  const conexao = await connectionDB.getConnection();
  try {
    await conexao.beginTransaction();

    const [resultado] = await conexao.query(
      `INSERT INTO cliente (nome, email, telefone, cpf, endereco)
       VALUES (?, ?, ?, ?, ?)`,
      [cliente.nome, cliente.email, cliente.telefone, cliente.cpf, cliente.endereco]
    );

    await conexao.query(
      'INSERT INTO cadastro (id_cliente, usuario, senha_hash) VALUES (?, ?, ?)',
      [resultado.insertId, usuario, senhaHash]
    );

    await conexao.commit();
    return resultado.insertId;
  } catch (erro) {
    await conexao.rollback();
    throw erro;               
  } finally {
    conexao.release();        
  }
}
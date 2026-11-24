import connectionDB from '../config/db.js';
import { AppError } from '../utils/appError.js';

export const MAX_POR_ITEM = 10;
const STATUS_CARRINHO = 'CARRINHO';
const CUPONS_VALIDOS = {
  PRIMEIRACOMPRA: { tipo: 'percentual', valor: 10, minimo: 0, descricao: '10% OFF' },
  SMART20: { tipo: 'fixo', valor: 20, minimo: 1000, descricao: 'R$ 20,00 OFF acima de R$ 1000' }
};

export function calcularDescontoCupom(codigoBruto, subtotal) {
  const codigo = String(codigoBruto ?? '').trim().toUpperCase();
  if (!codigo) return { codigo: null, desconto: 0, totalFinal: Number(subtotal) };

  const cupom = CUPONS_VALIDOS[codigo];
  if (!cupom) throw new AppError('Cupom inválido ou expirado.', 400);

  const valorBase = Number(subtotal);
  if (valorBase < cupom.minimo) {
    throw new AppError(
      `O cupom ${codigo} exige pedido mínimo de R$ ${cupom.minimo.toFixed(2).replace('.', ',')}.`,
      400
    );
  }

  const bruto = cupom.tipo === 'percentual'
    ? (valorBase * cupom.valor) / 100
    : cupom.valor;

  const desconto = Number(Math.min(bruto, valorBase).toFixed(2));
  const totalFinal = Number((valorBase - desconto).toFixed(2));

  return { codigo, desconto, totalFinal, descricao: cupom.descricao };
}

async function comTransacao(trabalho) {
  const conexao = await connectionDB.getConnection();
  try {
    await conexao.beginTransaction();
    const resultado = await trabalho(conexao);
    await conexao.commit();
    return resultado;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function travarCliente(conexao, idCliente) {
  await conexao.query('SELECT id_cliente FROM cliente WHERE id_cliente = ? FOR UPDATE', [idCliente]);
}

async function acharCarrinho(conexao, idCliente) {
  const [linhas] = await conexao.query(
    'SELECT id_compra FROM compra WHERE id_cliente = ? AND status_compra = ? LIMIT 1',
    [idCliente, STATUS_CARRINHO]
  );
  return linhas[0]?.id_compra ?? null;
}

async function acharOuCriarCarrinho(conexao, idCliente) {
  const existente = await acharCarrinho(conexao, idCliente);
  if (existente) return existente;
  const [r] = await conexao.query(
    'INSERT INTO compra (id_cliente, status_compra) VALUES (?, ?)',
    [idCliente, STATUS_CARRINHO]
  );
  return r.insertId;
}

async function montarCarrinho(conexao, idCompra, sincronizar = false) {
  if (!idCompra) return { id_compra: null, itens: [], quantidade_total: 0, total: '0.00' };

  if (sincronizar) {
    await conexao.query(
      `UPDATE carrinho_de_compra ci
         JOIN produto p ON p.id_produto = ci.id_produto
          SET ci.preco_unitario = p.preco
        WHERE ci.id_compra = ? AND ci.preco_unitario <> p.preco`,
      [idCompra]
    );
    await conexao.query(
      `UPDATE compra
          SET valor_total = (SELECT COALESCE(SUM(subtotal), 0)
                               FROM carrinho_de_compra WHERE id_compra = ?)
        WHERE id_compra = ?`,
      [idCompra, idCompra]
    );
  }

  const [itens] = await conexao.query(
    `SELECT ci.id_produto, p.nome, p.imagem, ci.quantidade,
            p.preco AS preco_unitario,
            ci.quantidade * p.preco AS subtotal,
            p.estoque,
            (p.ativo = TRUE AND c.ativa = TRUE AND p.estoque >= ci.quantidade) AS disponivel
       FROM carrinho_de_compra ci
       JOIN produto p ON p.id_produto = ci.id_produto
       JOIN colecao c ON c.id_colecao = p.id_colecao
      WHERE ci.id_compra = ?
      ORDER BY ci.id_carrinho`,
    [idCompra]
  );
  const [[soma]] = await conexao.query(
    `SELECT COALESCE(SUM(ci.quantidade * p.preco), 0) AS total,
            COALESCE(SUM(ci.quantidade), 0) AS quantidade_total
       FROM carrinho_de_compra ci JOIN produto p ON p.id_produto = ci.id_produto
      WHERE ci.id_compra = ?`,
    [idCompra]
  );

  return {
    id_compra: idCompra,
    itens: itens.map((i) => ({ ...i, disponivel: Boolean(i.disponivel) })),
    quantidade_total: Number(soma.quantidade_total),
    total: soma.total
  };
}
export async function obter(idCliente) {
  const conexao = await connectionDB.getConnection();
  try {
    return await montarCarrinho(conexao, await acharCarrinho(conexao, idCliente));
  } finally {
    conexao.release();
  }
}

export function adicionar(idCliente, idProduto, quantidade) {
  return comTransacao(async (conexao) => {
    await travarCliente(conexao, idCliente);

    const [produtos] = await conexao.query(
      `SELECT p.preco, p.estoque
         FROM produto p JOIN colecao c ON c.id_colecao = p.id_colecao
        WHERE p.id_produto = ? AND p.ativo = TRUE AND c.ativa = TRUE`,
      [idProduto]
    );
    if (!produtos[0]) throw new AppError('Produto não encontrado', 404);

    const idCompra = await acharOuCriarCarrinho(conexao, idCliente);
    const [atual] = await conexao.query(
      'SELECT quantidade FROM carrinho_de_compra WHERE id_compra = ? AND id_produto = ?',
      [idCompra, idProduto]
    );
    const novaQuantidade = (atual[0]?.quantidade ?? 0) + quantidade;

    validarQuantidade(novaQuantidade, produtos[0].estoque);

    await conexao.query(
      `INSERT INTO carrinho_de_compra (id_compra, id_produto, quantidade, preco_unitario)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantidade = VALUES(quantidade),
                               preco_unitario = VALUES(preco_unitario)`,
      [idCompra, idProduto, novaQuantidade, produtos[0].preco]
    );
    return montarCarrinho(conexao, idCompra, true);
  });
}

export function definirQuantidade(idCliente, idProduto, quantidade) {
  return comTransacao(async (conexao) => {
    await travarCliente(conexao, idCliente);
    const idCompra = await acharCarrinho(conexao, idCliente);

    const [itens] = idCompra
      ? await conexao.query(
        `SELECT p.estoque
             FROM carrinho_de_compra ci JOIN produto p ON p.id_produto = ci.id_produto
            WHERE ci.id_compra = ? AND ci.id_produto = ?`,
        [idCompra, idProduto]
      )
      : [[]];
    if (!itens[0]) throw new AppError('Este produto não está no carrinho', 404);

    validarQuantidade(quantidade, itens[0].estoque);

    await conexao.query(
      'UPDATE carrinho_de_compra SET quantidade = ? WHERE id_compra = ? AND id_produto = ?',
      [quantidade, idCompra, idProduto]
    );
    return montarCarrinho(conexao, idCompra, true);
  });
}

export function removerItem(idCliente, idProduto) {
  return comTransacao(async (conexao) => {
    await travarCliente(conexao, idCliente);
    const idCompra = await acharCarrinho(conexao, idCliente);

    const [r] = idCompra
      ? await conexao.query(
        'DELETE FROM carrinho_de_compra WHERE id_compra = ? AND id_produto = ?',
        [idCompra, idProduto]
      )
      : [{ affectedRows: 0 }];
    if (r.affectedRows === 0) throw new AppError('Este produto não está no carrinho', 404);

    return montarCarrinho(conexao, idCompra, true);
  });
}

export function esvaziar(idCliente) {
  return comTransacao(async (conexao) => {
    await travarCliente(conexao, idCliente);
    const idCompra = await acharCarrinho(conexao, idCliente);
    if (idCompra) await conexao.query('DELETE FROM carrinho_de_compra WHERE id_compra = ?', [idCompra]);
    return montarCarrinho(conexao, idCompra, true);
  });
}

function validarQuantidade(quantidade, estoque) {
  if (quantidade > MAX_POR_ITEM) {
    throw new AppError(`Limite de ${MAX_POR_ITEM} unidades por produto`, 409);
  }
  if (quantidade > estoque) {
    throw new AppError(
      estoque > 0 ? `Estoque insuficiente: restam ${estoque} unidade(s)` : 'Produto esgotado',
      409
    );
  }
}

export function finalizar(idCliente, codigoCupom = null) {
  return comTransacao(async (conexao) => {
    await travarCliente(conexao, idCliente);
    const idCompra = await acharCarrinho(conexao, idCliente);
    if (!idCompra) throw new AppError('Seu carrinho está vazio', 400);

    const carrinho = await montarCarrinho(conexao, idCompra, true);
    if (carrinho.itens.length === 0) throw new AppError('Seu carrinho está vazio', 400);

    const indisponivel = carrinho.itens.find((i) => !i.disponivel);
    if (indisponivel) {
      throw new AppError(`Produto "${indisponivel.nome}" indisponível ou sem estoque suficiente`, 409);
    }

    const { desconto, totalFinal } = calcularDescontoCupom(codigoCupom, carrinho.total);

    for (const item of carrinho.itens) {
      const [resEstoque] = await conexao.query(
        'UPDATE produto SET estoque = estoque - ? WHERE id_produto = ? AND estoque >= ?',
        [item.quantidade, item.id_produto, item.quantidade]
      );
      if (resEstoque.affectedRows === 0) {
        throw new AppError(`Estoque insuficiente para "${item.nome}"`, 409);
      }
    }

    await conexao.query(
      `UPDATE compra
          SET status_compra = 'FINALIZADA',
              valor_total = ?,
              data_compra = CURRENT_TIMESTAMP,
              data_entrega_estimada = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY)
        WHERE id_compra = ?`,
      [totalFinal, idCompra]
    );

    const ano = new Date().getFullYear();
    const numeroNf = `NF-${ano}-${String(idCompra).padStart(6, '0')}`;

    const [resNf] = await conexao.query(
      `INSERT INTO nota_fiscal (id_compra, numero_nf, valor_total_nf, tipo_documento, status_nf)
       VALUES (?, ?, ?, 'NF-e', 'EMITIDA')`,
      [idCompra, numeroNf, totalFinal]
    );

    return {
      id_nota_fiscal: resNf.insertId,
      id_compra: idCompra,
      numero_nf: numeroNf,
      desconto_aplicado: desconto,
      valor_final: totalFinal
    };
  });
}

export async function obterNotaFiscal(idCliente, idNotaFiscal) {
  const [notas] = await connectionDB.query(
    `SELECT nf.id_nota_fiscal, nf.numero_nf, nf.data_emissao, nf.valor_total_nf,
            nf.tipo_documento, nf.status_nf,
            co.id_compra, co.data_entrega_estimada,
            cl.nome AS cliente_nome, cl.cpf AS cliente_cpf, cl.email AS cliente_email
       FROM nota_fiscal nf
       JOIN compra co ON co.id_compra = nf.id_compra
       JOIN cliente cl ON cl.id_cliente = co.id_cliente
      WHERE nf.id_nota_fiscal = ? AND co.id_cliente = ?`,
    [idNotaFiscal, idCliente]
  );
  if (!notas[0]) throw new AppError('Nota fiscal não encontrada', 404);

  const [itens] = await connectionDB.query(
    `SELECT ci.id_produto, p.nome, ci.quantidade, ci.preco_unitario, ci.subtotal
       FROM carrinho_de_compra ci
       JOIN produto p ON p.id_produto = ci.id_produto
      WHERE ci.id_compra = ?
      ORDER BY ci.id_carrinho`,
    [notas[0].id_compra]
  );

  return { ...notas[0], itens };
}

export async function listarPedidos(idCliente) {
  const [pedidos] = await connectionDB.query(
    `SELECT co.id_compra, co.data_compra, co.valor_total, co.status_compra, co.data_entrega_estimada,
            nf.id_nota_fiscal, nf.numero_nf
       FROM compra co
       LEFT JOIN nota_fiscal nf ON nf.id_compra = co.id_compra
      WHERE co.id_cliente = ? AND co.status_compra = 'FINALIZADA'
      ORDER BY co.data_compra DESC`,
    [idCliente]
  );
  return pedidos;
}
USE projeto_integrador;

SELECT c.nome,
       p.id_compra,
       p.data_compra,
       p.valor_total
FROM compra p
JOIN cliente c ON c.id_cliente = p.id_cliente
WHERE p.status_compra = 'ENTREGUE'
ORDER BY p.data_compra DESC;

SELECT c.nome,
       ca.usuario,
       ca.data_criacao
FROM cliente c
JOIN cadastro ca ON ca.id_cliente = c.id_cliente
WHERE ca.ativo = TRUE
ORDER BY c.nome;

SELECT c.id_cliente,
       c.nome
FROM cliente c
LEFT JOIN compra p ON p.id_cliente = c.id_cliente
WHERE p.id_compra IS NULL
ORDER BY c.nome;

SELECT p.id_compra,
       c.nome,
       p.valor_total,
       p.status_compra
FROM compra p
JOIN cliente c ON c.id_cliente = p.id_cliente
LEFT JOIN nota_fiscal n ON n.id_compra = p.id_compra
WHERE n.id_nota_fiscal IS NULL
ORDER BY p.id_compra;

SELECT c.nome,
       COUNT(p.id_compra) AS qtd_compras,
       SUM(p.valor_total) AS total_comprado
FROM cliente c
JOIN compra p ON p.id_cliente = c.id_cliente
WHERE p.status_compra <> 'CANCELADA'
GROUP BY c.id_cliente, c.nome
ORDER BY total_comprado DESC;

SELECT status_compra,
       COUNT(*)         AS qtd,
       SUM(valor_total) AS soma_valores
FROM compra
GROUP BY status_compra
ORDER BY qtd DESC, status_compra;

SELECT c.nome,
       COUNT(*) AS qtd_compras
FROM cliente c
JOIN compra p ON p.id_cliente = c.id_cliente
GROUP BY c.id_cliente, c.nome
HAVING COUNT(*) > 1
ORDER BY qtd_compras DESC, c.nome;

SELECT p.id_compra,
       c.nome,
       i.id_produto,
       i.quantidade,
       i.preco_unitario,
       i.subtotal
FROM carrinho_de_compra i
JOIN compra p  ON p.id_compra  = i.id_compra
JOIN cliente c ON c.id_cliente = p.id_cliente
ORDER BY p.id_compra, i.id_carrinho;

SELECT c.nome,
       COUNT(*) AS falhas
FROM login l
JOIN cliente c ON c.id_cliente = l.id_cliente
WHERE l.sucesso = FALSE
GROUP BY c.id_cliente, c.nome
HAVING COUNT(*) >= 2;

SELECT n.numero_nf,
       n.tipo_documento,
       n.status_nf,
       n.valor_total_nf,
       COALESCE(cc.nome, cv.nome) AS cliente
FROM nota_fiscal n
LEFT JOIN compra p  ON p.id_compra = n.id_compra
LEFT JOIN cliente cc ON cc.id_cliente = p.id_cliente
LEFT JOIN venda v  ON v.id_venda  = n.id_venda
LEFT JOIN cliente cv ON cv.id_cliente = v.id_cliente
ORDER BY n.numero_nf;




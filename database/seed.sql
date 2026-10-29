USE projeto_integrador;

INSERT INTO cliente (id_cliente, nome, email, telefone, cpf, endereco, data_cadastro) VALUES
(1, 'Ana Beatriz Souza', 'ana.souza@email.com', '11988881001', '11122233301', 'Rua das Flores, 120 - São Paulo/SP', '2026-08-01 09:10:00'),
(2, 'Bruno Carvalho', 'bruno.carvalho@email.com', '21988882002', '11122233302', 'Av. Atlântica, 450 - Rio de Janeiro/RJ', '2026-08-10 14:30:00'),
(3, 'Camila Ferreira', 'camila.ferreira@email.com','31988883003', '11122233303', 'Rua da Bahia, 800 - Belo Horizonte/MG', '2026-09-25 11:00:00'),
(4, 'Diego Martins', 'diego.martins@email.com', '41988884004', '11122233304', 'Rua XV de Novembro, 55 - Curitiba/PR', '2026-09-01 16:45:00'),
(5, 'Eduarda Lima', 'eduarda.lima@email.com', NULL,'11122233305', 'Rua Chile, 77 - Salvador/BA', '2026-09-15 10:20:00'),
(6, 'Felipe Rocha', 'felipe.rocha@email.com', '51988886006', '11122233306', 'Av. Ipiranga, 1500 - Porto Alegre/RS', '2026-10-01 08:55:00'),
(7, 'Gabriela Nunes', 'gabriela.nunes@email.com', '81988887007', '11122233307', 'Rua do Sol, 33 - Recife/PE', '2026-07-10 13:15:00'),
(8, 'Henrique Alves', 'henrique.alves@email.com', '61988888008', '11122233308', NULL, '2026-10-20 17:40:00');

INSERT INTO cadastro (id_cadastro, id_cliente, usuario, senha_hash, data_criacao, ativo) VALUES
(1, 1, 'ana.souza', '$2b$10$HASH_FICTICIO_0001', '2026-08-01 09:15:00', TRUE),
(2, 2, 'bruno.carvalho','$2b$10$HASH_FICTICIO_0002', '2026-08-10 14:35:00', TRUE),
(3, 3, 'camila.ferreira', '$2b$10$HASH_FICTICIO_0003', '2026-09-25 11:05:00', TRUE),
(4, 4, 'diego.martins', '$2b$10$HASH_FICTICIO_0004', '2026-09-01 16:50:00', FALSE),
(5, 5, 'eduarda.lima', '$2b$10$HASH_FICTICIO_0005', '2026-09-15 10:25:00', TRUE),
(6, 6, 'felipe.rocha', '$2b$10$HASH_FICTICIO_0006', '2026-10-01 09:00:00', TRUE),
(7, 7, 'gabriela.nunes','$2b$10$HASH_FICTICIO_0007', '2026-07-10 13:20:00', TRUE);

INSERT INTO login (id_login, id_cliente, data_hora_login, ip_endereco, navegador, sucesso) VALUES
(1,  1, '2026-08-05 10:20:00', '203.0.113.10', 'Chrome',  TRUE),
(2,  1, '2026-09-14 15:30:00', '203.0.113.10', 'Chrome',  TRUE),
(3,  2, '2026-09-20 09:00:00', '198.51.100.22', 'Firefox', FALSE),
(4,  2, '2026-09-20 09:02:00', '198.51.100.22', 'Firefox', TRUE),
(5,  3, '2026-10-02 18:10:00', '203.0.113.45', 'Safari',  TRUE),
(6,  3, '2026-10-18 10:55:00', '203.0.113.45', 'Safari',  TRUE),
(7,  4, '2026-10-10 13:50:00', '192.0.2.77', 'Edge', TRUE),
(8,  4, '2026-10-15 08:00:00', '192.0.2.77', 'Edge', FALSE),
(9,  4, '2026-10-15 08:01:00', '192.0.2.77', 'Edge', FALSE),
(10, 5, '2026-10-22 20:20:00', '198.51.100.90', 'Chrome', TRUE),
(11, 7, '2026-07-15 08:40:00', '203.0.113.130', 'Chrome', TRUE),
(12, 7, '2026-10-24 12:00:00', '203.0.113.130', 'Chrome', TRUE);

INSERT INTO consulta (id_consulta, id_cliente, tipo_consulta, data_consulta, descricao, consulta_status) VALUES
(1, 1, 'STATUS_PEDIDO', '2026-08-08 09:00:00', 'Perguntou sobre o prazo de entrega da compra 1.', 'RESOLVIDO'),
(2, 2, 'DUVIDA_PRODUTO', '2026-09-18 15:20:00', 'Dúvida sobre compatibilidade do produto 104.', 'RESOLVIDO'),
(3, 3, 'SEGUNDA_VIA_NF', '2026-10-05 10:10:00', 'Solicitou segunda via da nota fiscal NF-000004.', 'EM_ANDAMENTO'),
(4, 4, 'CANCELAMENTO', '2026-10-09 11:30:00', 'Pedido de cancelamento da compra 6.', 'RESOLVIDO'),
(5, 5, 'SUPORTE_TECNICO', '2026-10-23 19:45:00', 'Não consegue concluir o pagamento da compra 7.', 'ABERTO'),
(6, 7, 'DUVIDA_PRODUTO',  '2026-10-24 12:10:00', 'Quer saber se o produto 106 tem garantia estendida.', 'ABERTO');

INSERT INTO compra (id_compra, id_cliente, data_compra, valor_total, status_compra, data_entrega_estimada) VALUES
(1, 1, '2026-08-05 10:30:00', 249.80, 'ENTREGUE',  '2026-08-12 18:00:00'),
(2, 1, '2026-09-14 15:45:00', 299.90, 'ENTREGUE',  '2026-09-21 18:00:00'),
(3, 2, '2026-09-20 09:10:00', 214.80, 'ENVIADA',   '2026-09-27 18:00:00'),
(4, 3, '2026-10-02 18:20:00', 359.90, 'PAGA',      '2026-10-09 18:00:00'),
(5, 3, '2026-10-18 11:05:00', 100.00, 'PENDENTE',  NULL),
(6, 4, '2026-10-10 14:00:00', 299.90, 'CANCELADA', '2026-10-17 18:00:00'),
(7, 5, '2026-10-22 20:30:00', 229.70, 'PENDENTE',  '2026-10-29 18:00:00'),
(8, 7, '2026-07-15 08:50:00', 299.50, 'ENTREGUE',  '2026-07-22 18:00:00');

INSERT INTO venda (id_venda, id_cliente, data_venda, valor_venda, status_venda, descricao_produto) VALUES
(1, 2, '2026-08-20 13:00:00', 350.00, 'CONCLUIDA', 'Teclado mecânico RGB'),
(2, 4, '2026-09-05 16:40:00', 120.00, 'CONCLUIDA', 'Mouse sem fio'),
(3, 5, '2026-09-28 10:15:00', 899.90, 'CONCLUIDA', 'Monitor 24 polegadas'),
(4, 1, '2026-10-12 17:30:00',  75.50, 'CANCELADA', 'Cabo HDMI 2m'),
(5, 3, '2026-10-25 09:00:00', 240.00, 'PENDENTE',  'Headset gamer');

INSERT INTO carrinho_de_compra (id_carrinho, id_compra, id_produto, quantidade, preco_unitario) VALUES
(1,  1, 101, 2,  49.90),
(2,  1, 102, 1, 150.00),
(3,  2, 103, 1, 299.90),
(4,  3, 101, 1,  49.90),
(5,  3, 104, 3,  25.00),
(6,  3, 105, 1,  89.90),
(7,  4, 102, 2, 150.00),
(8,  4, 106, 1,  59.90),
(9,  5, 104, 4,  25.00),
(10, 6, 103, 1, 299.90),
(11, 7, 105, 2,  89.90),
(12, 7, 101, 1,  49.90),
(13, 8, 106, 5,  59.90);

INSERT INTO nota_fiscal (id_nota_fiscal, id_compra, id_venda, numero_nf, data_emissao, valor_total_nf, tipo_documento, status_nf) VALUES
(1, 1, NULL, 'NF-000001', '2026-08-05 11:00:00', 249.80, 'NF_COMPRA', 'EMITIDA'),
(2, 2, NULL, 'NF-000002', '2026-09-14 16:00:00', 299.90, 'NF_COMPRA', 'EMITIDA'),
(3, 3, NULL, 'NF-000003', '2026-09-20 09:30:00', 214.80, 'NF_COMPRA', 'EMITIDA'),
(4, 4, NULL, 'NF-000004', '2026-10-02 18:40:00', 359.90, 'NF_COMPRA', 'EMITIDA'),
(5, 6, NULL, 'NF-000005', '2026-10-10 14:10:00', 299.90, 'NF_COMPRA', 'CANCELADA'),
(6, 8, NULL, 'NF-000006', '2026-07-15 09:10:00', 299.50, 'NF_COMPRA', 'EMITIDA'),
(7, NULL, 1, 'NF-000007', '2026-08-20 13:10:00', 350.00, 'NF_VENDA',  'EMITIDA'),
(8, NULL, 2, 'NF-000008', '2026-09-05 16:50:00', 120.00, 'NF_VENDA',  'EMITIDA'),
(9, NULL, 3, 'NF-000009', '2026-09-28 10:30:00', 899.90, 'NF_VENDA',  'EMITIDA');

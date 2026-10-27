DROP DATABASE IF EXISTS projeto_integrador;
CREATE DATABASE IF NOT EXISTS projeto_integrador;
USE projeto_integrador;

CREATE TABLE cliente (
id_cliente INT NOT NULL AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
email VARCHAR(120) NOT NULL,
telefone VARCHAR(20),
cpf CHAR(11) NOT NULL,
endereco VARCHAR(200),
data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT PRIMARY KEY (id_cliente),
CONSTRAINT uk_cliente_cpf UNIQUE (cpf)
);

CREATE TABLE cadastro (
id_cadastro INT NOT NULL AUTO_INCREMENT,
id_cliente INT NOT NULL,
usuario VARCHAR(120) NOT NULL UNIQUE,
senha_hash VARCHAR(255) NOT NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ativo BOOLEAN NOT NULL DEFAULT TRUE,

CONSTRAINT PRIMARY KEY (id_cadastro),
CONSTRAINT fk_cadastro_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

CREATE TABLE consulta (
id_consulta INT NOT NULL AUTO_INCREMENT,
id_cliente INT NOT NULL,
tipo_consulta VARCHAR(50) NOT NULL,
data_consulta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
descricao VARCHAR(200),
consulta_status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',

CONSTRAINT PRIMARY KEY (id_consulta),
CONSTRAINT fk_consulta_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

CREATE TABLE login (
id_login INT NOT NULL AUTO_INCREMENT,
id_cliente INT NOT NULL,
data_hora_login DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ip_endereco VARCHAR(45),
navegador VARCHAR(100),
sucesso BOOLEAN NOT NULL,

CONSTRAINT PRIMARY KEY (id_login),
CONSTRAINT fk_login_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

CREATE TABLE compra (
id_compra INT NOT NULL AUTO_INCREMENT,
id_cliente INT NOT NULL,
data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
status_compra VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
data_entrega_estimada DATETIME,

CONSTRAINT PRIMARY KEY (id_compra),
CONSTRAINT fk_compra_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente),
CONSTRAINT ck_compra_valor CHECK (valor_total >= 0),
CONSTRAINT ck_compra_entrega CHECK (data_entrega_estimada IS NULL OR data_entrega_estimada >= data_compra)
);

CREATE TABLE venda (
id_venda INT NOT NULL AUTO_INCREMENT,
id_cliente INT NOT NULL,
data_venda DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
valor_venda DECIMAL(10,2) NOT NULL,
status_venda VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
descricao_produto VARCHAR(255),

CONSTRAINT PRIMARY KEY (id_venda),
CONSTRAINT fk_venda_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente),
CONSTRAINT ck_venda_valor CHECK (valor_venda >= 0)
);

CREATE TABLE carrinho_de_compra (
id_carrinho INT NOT NULL AUTO_INCREMENT,
id_compra INT NOT NULL,
id_produto INT NOT NULL,
quantidade INT NOT NULL DEFAULT 1,
preco_unitario DECIMAL(10,2) NOT NULL,
subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED,
 
CONSTRAINT PRIMARY KEY (id_carrinho),
CONSTRAINT fk_carrinho_compra FOREIGN KEY (id_compra) REFERENCES compra (id_compra) ON DELETE CASCADE,
CONSTRAINT ck_carrinho_qtd CHECK (quantidade > 0),
CONSTRAINT ck_carrinho_preco CHECK (preco_unitario >= 0)
);

CREATE TABLE nota_fiscal (
id_nota_fiscal INT NOT NULL AUTO_INCREMENT,
id_compra INT NULL,
id_venda INT  NULL,
numero_nf VARCHAR(20) NOT NULL UNIQUE,
data_emissao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
valor_total_nf DECIMAL(10,2) NOT NULL,
tipo_documento VARCHAR(30) NOT NULL,
status_nf VARCHAR(20) NOT NULL DEFAULT 'EMITIDA',
 
CONSTRAINT PRIMARY KEY (id_nota_fiscal),
CONSTRAINT fk_nota_fiscal_compra FOREIGN KEY (id_compra) REFERENCES compra (id_compra),
CONSTRAINT fk_nota_fiscal_venda FOREIGN KEY (id_venda) REFERENCES venda (id_venda),
CONSTRAINT ck_nota_fiscal_valor  CHECK (valor_total_nf >= 0),
CONSTRAINT ck_nota_fiscal_origem CHECK (
(id_compra IS NOT NULL AND id_venda IS NULL) OR (id_compra IS NULL AND id_venda IS NOT NULL))
);
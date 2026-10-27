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

CONSTRAINT pk_cliente PRIMARY KEY (id_cliente),
CONSTRAINT uk_cliente_cpf UNIQUE (cpf)
);

CREATE TABLE cadastro (
id_cadastro INT NOT NULL AUTO_INCREMENT,
id_cliente INT NOT NULL,
usuario VARCHAR(120) NOT NULL,
senha_hash VARCHAR(255) NOT NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ativo BOOLEAN NOT NULL DEFAULT TRUE,

CONSTRAINT pk_cadastro PRIMARY KEY (id_cadastro),
CONSTRAINT fk_cadastro_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

CREATE TABLE consulta (
id_consulta INT NOT NULL AUTO_INCREMENT,
id_cliente INT NOT NULL,
tipo_consulta VARCHAR(50) NOT NULL,
data_consulta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
descricao VARCHAR(100) NOT NULL,
status_produto VARCHAR(20) NOT NULL DEFAULT 'ABERTO',

CONSTRAINT pk_consulta PRIMARY KEY (id_consulta),
CONSTRAINT fk_consulta_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

CREATE TABLE login (
id_login INT NOT NULL AUTO_INCREMENT,
id_cliente 
);

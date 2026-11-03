<div align="center">
  <br /><br />

  <h1>🛒 TCM LOJA</h1>
  
  <h3>Sistema de Gestão e e-Commerce — SmartClothes</h3>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />

  <p>
    Uma solução Full Stack moderna para gerenciamento de clientes, cadastros e compras, construída com arquitetura MVC escalável em Node.js e MySQL.
  </p>

  ---

</div>

<br />

## 📖 Sobre o Projeto

O **TCM Loja** é um sistema desenvolvido como parte do Projeto Integrador, projetado para intermediar o cadastro de clientes, consultas e fluxo de compras em uma plataforma de e-Commerce. 

A aplicação conta com uma API RESTful estruturada no padrão **MVC (Model-View-Controller)**, garantindo a separação clara entre as regras de negócio, persistência de dados e a interface de usuário.

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
* **Node.js** (Ambiente de execução)
* **Express.js** (Framework web para rotas e middlewares)
* **MySQL2** (Driver de alta performance para conexão com o banco)
* **CORS** (Controle de acesso HTTP)
* **Dotenv** (Gerenciamento de variáveis de ambiente)

### **Frontend**
* **HTML5 & CSS3** (Estrutura e estilização responsiva)
* **JavaScript ES6+** (Consumo da API com `fetch` assíncrono e escopo modular)

---

## ⚙️ Funcionalidades

- [x] **Gestão de Clientes (CRUD Completo):**
  - [x] Listagem geral de clientes cadastrados.
  - [x] Busca filtrada por ID do cliente.
  - [x] Cadastro com validação matemática rigorosa de CPF.
  - [x] Sanitização automática de dados de entrada (`string.trim()`, limpeza de caracteres).
  - [x] Atualização de dados cadastrais.
  - [x] Exclusão de cliente com tratamento de restrições de integridade referencial (*Foreign Keys* nas tabelas de `compra`, `cadastro` e `consulta`).
- [x] **Tratamento Global de Erros:**
  - [x] Respostas HTTP semânticas (`400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`).
  - [x] Mensagens amigáveis para duplicidade de registros (E-mail ou CPF únicos).

---

## 📁 Estrutura de Pastas

```text
TCM-loja/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexão com o Banco de Dados (db.js)
│   │   ├── controllers/     # Validações HTTP e controle de fluxo
│   │   ├── middlewares/     # Tratamento centralizado de erros e async handlers
│   │   ├── models/          # Queries SQL puras e regras de persistência
│   │   ├── routes/          # Mapeamento de endpoints da API
│   │   ├── utils/           # Módulos utilitários (validarCPF, AppError)
│   │   ├── app.js           # Configuração de middlewares Globais e Express
│   │   └── server.js        # Inicialização do servidor HTTP
├── database/                # Modelagem do banco (schema.sql, queries.sql, seed.sql)
├── docs/                    # Documentação do projeto
└── frontend/
    ├── css/                 # Estilização da interface
    ├── js/                  # Módulos JS de consumo da API (api.js)
    └── pages/               # Telas do sistema
```

## Autor
Pablo Alves
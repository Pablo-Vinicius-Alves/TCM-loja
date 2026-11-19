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

## Sumário
 
1. [Funcionalidades](#1-funcionalidades)
2. [Tecnologias](#2-tecnologias)
3. [Arquitetura](#3-arquitetura)
4. [Estrutura de pastas](#4-estrutura-de-pastas)
5. [Banco de dados](#5-banco-de-dados)
6. [Como executar](#6-como-executar)
7. [Variáveis de ambiente](#7-variáveis-de-ambiente)
8. [Referência da API](#8-referência-da-api)
9. [Páginas do front-end](#9-páginas-do-front-end)
10. [Regras de negócio importantes](#10-regras-de-negócio-importantes)
11. [Segurança](#11-segurança)
12. [Problemas comuns](#12-problemas-comuns)
13. [Equipe](#13-equipe)
---
 
## 1. Funcionalidades
 
- **Vitrine:** página inicial com produtos em destaque, carregados do banco.
- **Coleções:** produtos agrupados por coleção ativa.
- **Cadastro e login:** CPF validado (dígitos verificadores), senha com hash, sessão por cookie.
- **Carrinho:** adicionar, alterar quantidade, remover e esvaziar, com contador no menu.
- **Checkout:** finaliza o carrinho, gera o pedido e baixa o valor total de forma atômica (transação).
- **Nota fiscal (NF-e):** emitida a partir do pedido, com número, dados do cliente, itens, total e opção de imprimir/salvar em PDF.
- **Gestão de clientes:** CRUD completo (rotas protegidas).
## 2. Tecnologias
 
| Camada | Tecnologia |
|---|---|
| Servidor | Node.js (ES Modules) + Express |
| Banco | MariaDB (driver `mysql2/promise`, com *pool*) |
| Autenticação | JWT (HS256) em cookie `httpOnly` + `bcryptjs` |
| Front-end | HTML, CSS e JavaScript puro (módulos ES) |
| Configuração | `dotenv` |
| Ferramentas | HeidiSQL (administração do banco), VS Code |
 
## 3. Arquitetura
 
Cada requisição atravessa as camadas sempre na mesma ordem, e cada camada tem **uma** responsabilidade:
 
```
Navegador → Rota → (middleware autenticar) → Controller → Model → MariaDB
                                                  ↓
                                          resposta JSON
```
 
| Camada | Pasta | Responsabilidade |
|---|---|---|
| **Routes** | `routes/` | Mapeia verbo + URL para um controller. Define o que é público e o que exige login. |
| **Middlewares** | `middlewares/` | Código que roda antes/depois: autenticação, `asyncHandler`, tratamento de erros. |
| **Controllers** | `controllers/` | Lê e valida a entrada (`req`), chama o model, devolve a resposta HTTP. Não escreve SQL. |
| **Models** | `models/` | Todo o SQL (sempre parametrizado) e as transações. Não conhece `req`/`res`. |
| **Utils** | `utils/` | Funções puras reutilizáveis (CPF, token, parâmetros, `AppError`). |
| **Config** | `config/` | Leitura do `.env` e criação do pool de conexões. |
 
**Tratamento de erros centralizado:** controllers e models lançam `AppError(mensagem, status, detalhes)`; o middleware `erros.js` converte em resposta JSON padronizada (`{ "erro": "..." }`) e traduz erros do banco (por exemplo `ER_DUP_ENTRY` vira "já cadastrado").
 
## 4. Estrutura de pastas
 
```
TCM-loja/
├── backend/
│   └── src/
│       ├── config/          # env.js (lê .env) e db.js (pool MariaDB)
│       ├── controllers/     # auth, cliente, produto, colecao, carrinho
│       ├── middlewares/     # async.js, authenticate.js, erros.js
│       ├── models/          # authModel, produtoModel, colecaoModel, carrinhoModel...
│       ├── routes/          # uma rota por entidade + index.js (monta tudo em /api)
│       ├── utils/           # appError.js, cpf.js, params.js, token.js, validate.js
│       ├── app.js           # monta o Express (middlewares, /api, estáticos, 404, erros)
│       └── server.js        # sobe o servidor na porta
├── database/                # schema.sql, seed.sql, queries.sql, migrações
├── docs/                    # DER e documentação
├── frontend/
│   ├── css/                 # estilos das páginas
│   ├── imgs/                # fotos dos produtos e logo
│   ├── js/                  # loja.js (API), sessao.js, vitrine.js, colecoes.js, carrinho.js, auth.js
│   └── pages/               # index, auth, colecoes, carrinho, nota fiscal
├── .env                     # segredos locais (NÃO vai para o Git)
├── .env.example             # modelo do .env (vai para o Git)
├── .gitignore
└── package.json
```
 
> O Express serve `frontend/` como **raiz do site**. Por isso as páginas abrem em `http://localhost:3000/pages/...` e as imagens em `/imgs/...`.
 
## 5. Banco de dados
 
SGBD: **MariaDB**. Banco: `projeto_integrador` 
 
### Tabelas
 
| Tabela | Papel |
|---|---|
| `cliente` | Dados pessoais (nome, CPF único, e-mail, telefone). |
| `cadastro` | Credenciais: usuário, hash da senha, flag `ativo`. 1:1 com cliente. |
| `login` | Histórico de tentativas de acesso (IP, navegador, sucesso). Base do bloqueio por tentativas. |
| `consulta` | Atendimentos/consultas do cliente. |
| `colecao` | Coleções da loja (nome, descrição, ativa). |
| `produto` | Catálogo: nome, descrição, preço `DECIMAL(10,2)`, imagem, estoque, coleção. |
| `compra` | Pedido. Também guarda o **carrinho** (`status_compra = 'CARRINHO'`). |
| `carrinho_de_compra` | Itens do pedido/carrinho: produto, quantidade e **preço unitário gravado no momento**. |
| `venda` | Registro de venda (lado da loja). |
| `nota_fiscal` | NF-e vinculada a uma compra **ou** a uma venda (nunca as duas). |
 
### Relacionamentos principais
 
```
cliente 1──1 cadastro
cliente 1──N login | consulta | compra | venda
colecao 1──N produto
compra  1──N carrinho_de_compra N──1 produto
compra  1──0..1 nota_fiscal   (ou venda 1──0..1 nota_fiscal)
```
 
### Restrições relevantes
 
- `cliente.cpf` é `CHAR(11)` **somente dígitos**, com `UNIQUE` (`uk_cliente_cpf`).
- `carrinho_de_compra` tem `UNIQUE (id_compra, id_produto)`: o mesmo produto não duplica linha, apenas soma quantidade.
- `nota_fiscal` tem `CHECK` garantindo que a nota pertence a **compra XOR venda**.
- Valores monetários são `DECIMAL`, nunca `FLOAT`.
### Scripts SQL (`database/`)
 
| Arquivo | Uso |
|---|---|
| `schema.sql` | Cria o banco **do zero**. ⚠️ Começa com `DROP DATABASE`: use só em ambiente novo. |
| `seed.sql` | Dados de exemplo (clientes, coleções, produtos, pedidos). |
| `queries.sql` | Consultas prontas (relatórios, joins). |
| `migracao_produtos.sql` | Migração **não destrutiva** que cria `colecao`/`produto` em um banco já existente. |
 
Diagrama: veja `docs/` (DER).
 
## 6. Como executar
 
### Pré-requisitos
 
- [Node.js](https://nodejs.org) 18 ou superior
- [MariaDB](https://mariadb.org) 10.5+ (HeidiSQL opcional)
- Git
### Passo a passo
 
```bash
# 1) Clonar e entrar na pasta
git clone <URL-DO-REPOSITORIO>
cd TCM-loja
 
# 2) Instalar dependências
npm install
 
# 3) Criar o .env a partir do modelo
cp .env.example .env        # no Windows: copy .env.example .env
```
 
**4) Gerar o segredo do JWT** e colar em `JWT_SECRET` no `.env`:
 
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
 
**5) Criar o banco.** No HeidiSQL (ou `mariadb -u root -p`), execute em ordem:
 
1. `database/schema.sql`
2. `database/seed.sql` (opcional, dados de exemplo)
**6) Subir o servidor:**
 
```bash
npm run dev      # com recarga automática
# ou
npm start
```
 
> Confira em `package.json` os nomes exatos dos scripts.
 
**7) Abrir no navegador:** `http://localhost:3000/pages/index.html`
 
> ⚠️ **Não use o Live Server (porta 5500).** O cookie de login e as chamadas `/api` só funcionam quando a página é servida pelo próprio Express (porta 3000).
 
### Verificação rápida
 
| URL | Esperado |
|---|---|
| `http://localhost:3000/api/produtos` | Lista JSON de produtos (`preco` como texto, ex.: `"159.90"`) |
| `http://localhost:3000/api/colecoes` | Lista JSON com `id_colecao`, `nome`, `total_produtos` |
| `http://localhost:3000/pages/index.html` | Vitrine renderizada |
 
## 7. Variáveis de ambiente
 
Arquivo `.env` na **raiz** do projeto (rode os comandos a partir da raiz).
 
| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `PORT` | não | Porta do servidor (padrão `3000`) | `3000` |
| `NODE_ENV` | não | `production` ativa cookie `Secure` | `development` |
| `DB_HOST` | **sim** | Host do banco | `localhost` |
| `DB_PORT` | não | Porta (padrão `3306`) | `3306` |
| `DB_USER` | **sim** | Usuário do banco | `root` |
| `DB_PASSWORD` | não | Senha (pode ser vazia em dev local) | `` |
| `DB_NAME` | **sim** | Nome do banco | `tcm_loja` |
| `JWT_SECRET` | **sim** | Segredo de assinatura, **mínimo 32 caracteres** | *(gerado no passo 4)* |
 
O servidor **recusa iniciar** se faltar variável obrigatória ou se o `JWT_SECRET` for curto, com mensagem indicando o que corrigir.
 
## 8. Referência da API
 
Base: `http://localhost:3000/api`. Respostas em JSON. Erros seguem `{ "erro": "mensagem", "detalhes": [...] }`.
 
🔓 = pública · 🔒 = exige login (cookie)
 
### Autenticação — `/auth`
 
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/registrar` | 🔓 | Cria cliente + cadastro. Valida CPF, e-mail e senha. |
| POST | `/auth/login` | 🔓 | Autentica e grava o cookie `httpOnly`. Bloqueia após muitas falhas recentes. |
| POST | `/auth/logout` | 🔓 | Limpa o cookie. |
| GET | `/auth/me` | 🔒 | Dados do cliente logado. (O front também tenta `/auth/perfil`.) |
 
Exemplo de registro:
 
```json
POST /api/auth/registrar
{
  "nome": "Maria Silva",
  "cpf": "123.456.789-09",
  "email": "maria@email.com",
  "telefone": "11999998888",
  "usuario": "maria",
  "senha": "SenhaForte#2026"
}
```
 
### Vitrine — públicas
 
| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Lista produtos. Filtros: `?colecao=2&limite=6`. |
| GET | `/produtos/:id` | Detalhe de um produto. |
| GET | `/colecoes` | Lista coleções ativas com `total_produtos`. |
 
### Carrinho — 🔒 `/carrinho`
 
| Método | Rota | Corpo | Descrição |
|---|---|---|---|
| GET | `/carrinho` | — | Carrinho atual: itens, quantidades, subtotais e total. |
| POST | `/carrinho/itens` | `{ "id_produto": 3, "quantidade": 1 }` | Adiciona (soma se já existir). |
| PATCH | `/carrinho/itens/:idProduto` | `{ "quantidade": 2 }` | Define a quantidade. |
| DELETE | `/carrinho/itens/:idProduto` | — | Remove um item. |
| DELETE | `/carrinho` | — | Esvazia o carrinho. |
| POST | `/carrinho/finalizar` | — | Fecha o carrinho e cria o pedido (**201**). |
 
### Clientes — 🔒 `/clientes`
 
| Método | Rota | Descrição |
|---|---|---|
| GET | `/clientes` | Lista clientes. |
| GET | `/clientes/:id` | Busca um cliente. |
| POST | `/clientes` | Cria. |
| PUT | `/clientes/:id` | Atualiza. |
| DELETE | `/clientes/:id` | Remove. |
 
### Códigos de status usados
 
| Código | Quando |
|---|---|
| 200 / 201 | Sucesso / criado |
| 400 | Dado inválido (CPF, quantidade, JSON mal formado) |
| 401 | Sem login ou token expirado |
| 404 | Recurso ou rota inexistente |
| 409 | Conflito (CPF/e-mail/usuário já cadastrado, estoque) |
| 429 | Muitas tentativas de login |
| 500 | Erro interno (detalhe só no terminal do servidor) |
 
> A emissão/consulta da **nota fiscal** usa a tabela `nota_fiscal` e a página de NF-e. Documente aqui a rota exata adotada pela equipe (por exemplo `GET /api/notas/:idCompra`).
 
## 9. Páginas do front-end
 
| Página | Caminho | Função |
|---|---|---|
| Início | `/pages/index.html` | Banner e vitrine de produtos. |
| Login / Criar conta | `/pages/auth.html` | Abas de entrada e cadastro. |
| Coleções | `/pages/colecoes.html` | Uma seção por coleção, com cartões de produto. |
| Carrinho | `/pages/carrinho.html` | Tabela de itens, quantidades, total, finalizar. |
| Nota fiscal | `/pages/` (página de NF-e) | Nota emitida com itens, total e botão imprimir/salvar PDF. |
 
**Scripts compartilhados** (`frontend/js/`):
 
- `loja.js`: cliente HTTP da API (`chamar`, `entrar`, `listarProdutos`, `adicionarAoCarrinho`...). Usa sempre **caminhos relativos** (`/api/...`).
- `sessao.js`: verifica o login ao abrir qualquer página, troca "Login" por **"Sair (Nome)"** e atualiza o contador do carrinho.
- Um arquivo por página (`vitrine.js`, `colecoes.js`, `carrinho.js`, `auth.js`).
## 10. Regras de negócio importantes
 
- **Carrinho é um pedido em rascunho:** uma linha em `compra` com `status_compra = 'CARRINHO'`. Ao finalizar, vira `PENDENTE`.
- **Preço congelado:** o `preco_unitario` do item é copiado do produto no momento da adição; mudar o preço depois não altera pedidos antigos.
- **Limite por item:** no máximo 10 unidades de cada produto por carrinho.
- **Finalização atômica:** o checkout usa **transação** com `SELECT ... FOR UPDATE` (trava o cliente e os produtos em ordem de id). Ou tudo é gravado, ou nada, e duas finalizações simultâneas não corrompem o total.
- **CPF:** armazenado só com dígitos; formatado (`000.000.000-00`) apenas na exibição.
- **Valores monetários:** a API devolve `DECIMAL` como **texto** para não perder centavos; o front formata em `R$`.
- **Nota fiscal:** número no formato `NF-AAAA-NNNNNN`, vinculada ao pedido, com previsão de entrega.
## 11. Segurança
 
- **Senhas:** nunca em texto puro; guardadas com hash `bcryptjs`.
- **Sessão:** JWT em cookie `httpOnly` (inacessível ao JavaScript, mitiga roubo por XSS) com `SameSite=Lax` (mitiga CSRF) e `Secure` em produção. Expira em 2 horas.
- **SQL Injection:** todas as consultas usam *placeholders* (`?`); nenhuma concatena entrada do usuário.
- **XSS:** o front insere texto via `textContent`, nunca `innerHTML` com dado do usuário/banco.
- **Força bruta:** a tabela `login` registra tentativas; falhas recentes em excesso bloqueiam o acesso (HTTP 429).
- **Segredos:** `.env` está no `.gitignore`. **Nunca** faça commit de senha de banco ou `JWT_SECRET`.
- **Mensagens de erro:** o cliente recebe mensagens genéricas; o detalhe técnico fica só no log do servidor.
## 12. Problemas comuns
 
| Sintoma | Causa provável | Solução |
|---|---|---|
| `Variáveis ausentes no .env` | `.env` ausente ou comando rodado fora da raiz | Crie o `.env` e rode `npm` na raiz. |
| `JWT_SECRET precisa ter pelo menos 32 caracteres` | Segredo curto | Gere com o comando do passo 4. |
| `ECONNREFUSED` / `Access denied` | MariaDB parado ou credenciais erradas | Inicie o serviço e confira `DB_*`. |
| `ERR_MODULE_NOT_FOUND` | Import sem `.js` ou arquivo ausente | ES Modules exigem a extensão no `import`. |
| 404 em `/api/...` | Rota não registrada em `routes/index.js` | Adicione `router.use('/colecoes', colecaoRoutes)` etc. |
| 404/405 ao entrar ou cadastrar | Página aberta pelo Live Server (5500) | Use `http://localhost:3000/pages/...`. |
| 401 logo após o login | Cookie não gravado (origem diferente) | Acesse tudo pela porta 3000. |
| "Este CPF já está cadastrado" para todo CPF | CPF sendo gravado como booleano | Use `limparCpf()` para o dado e `validarCPF()` só para checar. |
| Cartões sem foto | Campo `imagem` sem o caminho | `UPDATE produto SET imagem = CONCAT('/imgs/', imagem) WHERE imagem IS NOT NULL AND imagem NOT LIKE '/%';` e conferir os arquivos em `frontend/imgs/`. |
| Erro 1452 ao criar FK | Itens órfãos no carrinho | Rode `correcao_rapida.sql`. |
 
**Dica de diagnóstico:** abra o DevTools (F12) → aba **Network** → clique na requisição vermelha → veja *Payload* (o que foi enviado) e *Response* (o que o servidor respondeu). O stack trace completo fica no terminal do Node.
 
## 13. Equipe
 
| Nome | Responsabilidade |
|---|---|
| Pablo | Banco de dados, back-end (MVC), integração com o front |
| *(colega)* | Design e páginas do front-end (HTML/CSS) |
 
## Próximos passos (ideias)
 
- Página **Meus pedidos** (histórico por cliente).
- **Painel administrativo:** cadastrar produtos e atualizar status de pedidos.
- Rota para **coleções passadas** (inativas).
- Testes automatizados da API.
- Paginação nas listagens e *rate limit* geral.
---
 
# Casos de Uso - SmartClothes

Documento da Fase 1. Referências: `escopo.md` (RF = requisito funcional, RNF = requisito não funcional, RN = regra de negócio).

## 1. Atores

| Ator | Descrição |
|---|---|
| Visitante | Usuário não autenticado. Consulta o catálogo, monta carrinho e pode se cadastrar. |
| Cliente | Usuário autenticado com perfil "cliente". Finaliza e consulta seus pedidos. |
| Administrador | Usuário autenticado com perfil "admin". Gerencia categorias, produtos e pedidos. |

Cliente e Administrador herdam do Visitante (generalização no diagrama).

## 2. Lista de casos de uso

| ID | Caso de uso | Ator | Requisito | Relacionamento |
|---|---|---|---|---|
| UC01 | Cadastrar-se | Visitante | RF03 | |
| UC02 | Autenticar-se | Cliente, Administrador | RF04 | |
| UC03 | Consultar catálogo (listar, filtrar, ver detalhe) | Visitante, Cliente | RF05, RF06 | |
| UC04 | Gerenciar carrinho | Visitante, Cliente | RF07 | |
| UC05 | Finalizar pedido | Cliente | RF08 | `<<include>>` UC02 |
| UC06 | Consultar meus pedidos | Cliente | RF09 | `<<include>>` UC02 |
| UC07 | Gerenciar categorias | Administrador | RF01 | `<<include>>` UC02 |
| UC08 | Gerenciar produtos | Administrador | RF02 | `<<include>>` UC02 |

## 3. Descrição dos casos de uso

### UC01 - Cadastrar-se

- **Ator:** Visitante.
- **Pré-condição:** nenhuma.
- **Pós-condição:** usuário criado com perfil "cliente" e senha armazenada como hash.
- **Fluxo principal:**
  1. Visitante informa nome, e-mail, senha e confirmação de senha.
  2. O front intercepta o `submit` e valida preenchimento, formato do e-mail, tamanho mínimo da senha (8 caracteres) e igualdade entre senha e confirmação.
  3. O front envia nome, e-mail e senha à API.
  4. O sistema valida os dados novamente e confirma que o e-mail não existe (RN01).
  5. O sistema grava o usuário com o hash da senha e perfil "cliente".
  6. O front exibe confirmação e redireciona para o login.
- **Regras:** RN01, RNF03, RNF05.

### UC02 - Autenticar-se

- **Ator:** Cliente ou Administrador.
- **Pré-condição:** usuário cadastrado e ativo.
- **Pós-condição:** sessão iniciada; token guardado no `localStorage` (RNF04).
- **Fluxo principal:**
  1. Usuário informa e-mail e senha.
  2. O front intercepta o `submit` e valida se os campos estão preenchidos.
  3. O sistema busca o usuário pelo e-mail e compara a senha com o hash.
  4. O sistema emite um token contendo id e perfil do usuário.
- **Regras:** RNF03, RNF04, RNF05.

### UC03 - Consultar catálogo

- **Ator:** Visitante ou Cliente.
- **Pré-condição:** nenhuma.
- **Pós-condição:** nenhuma alteração de dados.
- **Fluxo principal:**
  1. Usuário abre a página do catálogo.
  2. O front solicita a lista de produtos à API.
  3. O sistema retorna somente produtos ativos, com nome, preço, imagem e categoria.
  4. O front exibe os produtos.
  5. Usuário seleciona uma categoria; o front solicita a lista filtrada (RF06) e atualiza a exibição.
  6. Usuário abre um produto; o front solicita o detalhe e exibe descrição, tecnologia do tecido, preço e disponibilidade.

### UC04 - Gerenciar carrinho

- **Ator:** Visitante ou Cliente.
- **Pré-condição:** nenhuma.
- **Pós-condição:** carrinho atualizado no `localStorage`.
- **Fluxo principal:**
  1. Usuário adiciona um produto ao carrinho (quantidade inicial 1).
  2. O front grava no `localStorage` apenas **id e quantidade** de cada item.
  3. Usuário altera a quantidade ou remove um item.
  4. O front relê os preços e nomes na API e exibe os itens e a prévia do total (RN03).
- **Regras:** RN03, RN07, RNF04.

### UC05 - Finalizar pedido

- **Ator:** Cliente.
- **Pré-condições:** carrinho com ao menos um item (RN04); cliente autenticado.
- **Pós-condições:** pedido e itens gravados, estoque baixado e carrinho esvaziado.
- **Fluxo principal:**
  1. Cliente aciona "Finalizar pedido".
  2. O front envia apenas **id do produto e quantidade** de cada item (nunca preço ou total).
  3. O sistema inicia uma transação.
  4. Para cada item, o sistema confere se o produto está ativo e se há estoque suficiente (RN02).
  5. O sistema grava o pedido, grava cada item com o preço unitário vigente (RN05) e baixa o estoque.
  6. O sistema calcula o total no servidor (RN03) e confirma a transação.
  7. O sistema retorna o número do pedido; o front esvazia o carrinho e exibe a confirmação.
- **Observação:** Se dois clientes compram a última unidade ao mesmo tempo, apenas um pode ter sucesso (por exemplo, `UPDATE produto SET estoque = estoque - ? WHERE id = ? AND estoque >= ?`, verificando as linhas afetadas).
- **Regras:** RN02, RN03, RN04, RN05, RN07.

### UC06 - Consultar meus pedidos

- **Ator:** Cliente.
- **Pré-condição:** cliente autenticado.
- **Pós-condição:** nenhuma alteração de dados.
- **Fluxo principal:**
  1. Cliente abre "Meus pedidos".
  2. O front solicita a lista à API com o token.
  3. O sistema identifica o cliente **pelo token** e retorna seus pedidos (número, status, total).
  4. Cliente seleciona um pedido; o sistema retorna os itens com nome, quantidade, preço unitário gravado e subtotal.
- **Regras:** o filtro pelo cliente nunca usa parâmetro enviado pela URL ou pelo corpo da requisição.

### UC07 - Gerenciar categorias

- **Ator:** Administrador.
- **Pré-condição:** autenticado com perfil admin (RN06).
- **Pós-condição:** categoria criada, alterada ou inativada.
- **Fluxo principal (cadastrar):**
  1. Admin informa nome e descrição.
  2. O sistema valida os dados e confirma que o nome é único.
  3. O sistema grava a categoria e retorna sucesso.
- **Exceções:**
  - Nome duplicado ou vazio: 409 ou 400.
  - Inativar categoria com produtos ativos: 409 (inativar ou mover os produtos antes).
- **Regras:** RN06, RN09.

### UC08 - Gerenciar produtos

- **Ator:** Administrador.
- **Pré-condição:** autenticado com perfil admin (RN06).
- **Pós-condição:** produto criado, alterado ou inativado.
- **Fluxo principal (cadastrar):**
  1. Admin informa nome, descrição, tecnologia do tecido, preço, estoque e categoria.
  2. O sistema valida os dados (RN07) e confirma que a categoria existe e está ativa.
  3. O sistema grava o produto e retorna sucesso.
- **Exceções:**
  - Dados inválidos (preço negativo, estoque negativo, nome vazio): 400.
  - Categoria inexistente ou inativa: 400 ou 409.
  - Perfil cliente: 403. Token ausente ou inválido: 401.
- **Regras:** RN05, RN06, RN07, RN09.

### UC09 - Gerenciar pedidos

- **Ator:** Administrador.
- **Pré-condições:** autenticado como admin; pedido existente.
- **Pós-condição:** status atualizado; se cancelado, estoque devolvido.
- **Fluxo principal:**
  1. Admin abre a lista de pedidos, com filtro opcional por status.
  2. Admin seleciona um pedido e escolhe o novo status.
  3. O sistema valida a transição (RN10) e grava o novo status.
- **Regras:** RN06, RN08, RN10.


# Escopo do projeto - SmartClothes 

## Objetivo 
Sistema web de loja virtual para moda tecnológica com tecidos inteligentes, permitindo que clientes realizem pedidos e que o administrador gerencie produtos e pedidos.

## Fluxo principal
Cadastro/login -> visualizar produtos -> adicionar/remover ao carrinho -> pedido -> Acompanhamento.

## MVP
- [ ] RF01 - Admin cadastra, edita e remove categorias
- [ ] RF02 - Admin cadastra, edita e remove produtos
- [ ] RF03 - Cliente se cadastra e faz login
- [ ] RF04 - Cliente filtra produtos por categoria
- [ ] RF05 - Cliente adiciona produtos ao carrinho
- [ ] RF06 - Cliente finaliza pedido (valida estoque, grava pedido e itens, baixa estoque)
- [ ] RF07 - Cliente consulta seus pedidos
- [ ] RF08 - Admin lista pedidos e altera status
- [ ] RF09 - Emissão automática da nota
- [ ] RF10 - Consulta da nota pelo admin e cliente

## Fora do MVP (se sobrar tempo)
- Pagamento simulado
- Cupom com desconto
- Avaliações
- Relatórios

## Regras de negócio 
- RN01 - Validação de login e senha, email único
- RN02 - Não é possível vender com estoque insuficiente
- RN03 - Cálculo total ao adicionar/remover produtos
- RN04 - Todo pedido exige ao menos um item.
- RN05 - CRUD completo

## Critério de "MVP pronto"
Um usuário novo se cadastra, faz um pedido e o estoque é baixado; o admin
vê o pedido e altera o status, com os dados corretos no banco.
# Escopo do projeto - SmartClothes 

## Objetivo 
Sistema web de loja virtual para moda tecnológica com tecidos inteligentes, permitindo que clientes realizem pedidos e que o administrador gerencie produtos e pedidos.

## Fluxo principal
Cadastro/login -> visualizar produtos -> adicionar/remover ao carrinho -> pedido -> Acompanhamento.

## MVP
- [X] RF03 - Cliente se cadastra e faz login
- [X] RF04 - Cliente filtra produtos por categoria
- [X] RF05 - Cliente adiciona produtos ao carrinho
- [X] RF06 - Cliente finaliza pedido (valida estoque, grava pedido e itens, baixa estoque)
- [X] RF07 - Cliente consulta seus pedidos
- [X] RF09 - Emissão automática da nota
- [X] RF10 - Consulta da nota pelo cliente

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
Um usuário novo se cadastra, faz um pedido e o estoque é baixado, imprime a nota automático 
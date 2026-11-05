
document.addEventListener('DOMContentLoaded', () => {
    // Busca os itens salvos no navegador ou cria uma lista vazia segura
    let carrinho = JSON.parse(localStorage.getItem('smartclothes_cart')) || [];

    const contagemCarrinho = document.getElementById('contagem-carrinho');
    const tabelaItens = document.getElementById('itens-carrinho');
    const resumoSubtotal = document.getElementById('resumo-subtotal');
    const resumoTotal = document.getElementById('resumo-total');
    const painelCheckout = document.getElementById('painel-checkout');
    const formPagamento = document.getElementById('form-pagamento');

    // Atualiza o numerozinho (X) no menu superior
    function atualizarContadorVisual() {
        if (!contagemCarrinho) return;
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contagemCarrinho.innerText = totalItens;
    }

    // Renderiza e desenha a tabela do carrinho de compras
    function renderizarCarrinho() {
        if (!tabelaItens) return;
        tabelaItens.innerHTML = '';

        // Se o closet estiver vazio, mostra o aviso que você pediu e oculta a cobrança
        if (carrinho.length === 0) {
            tabelaItens.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 4rem; color: var(--texto-suave); font-size: 1.1rem;">⚠️ Seu carrinho está vazio! Vá até o Início ou Coleções para escolher suas roupas.</td></tr>`;
            if (painelCheckout) painelCheckout.style.display = 'none';
            return;
        }

        if (painelCheckout) painelCheckout.style.display = 'block';
        let totalGeral = 0;

        carrinho.forEach((item, index) => {
            const precoNum = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.').trim());
            const subtotal = precoNum * item.quantidade;
            totalGeral += subtotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600; padding: 1.25rem;">${item.nome}</td>
                <td style="padding: 1.25rem;">${item.preco}</td>
                <td style="padding: 1.25rem;">
                    <button class="btn-qtd" data-index="${index}" data-acao="diminuir">-</button>
                    <span class="qtd-valor">${item.quantidade}</span>
                    <button class="btn-qtd" data-index="${index}" data-acao="aumentar">+</button>
                </td>
                <td style="font-weight:600; color:var(--primaria); padding: 1.25rem;">R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style="padding: 1.25rem;"><button class="btn-remover" data-index="${index}">Excluir</button></td>
            `;
            tabelaItens.appendChild(tr);
        });

        if (resumoSubtotal) resumoSubtotal.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        if (resumoTotal) resumoTotal.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        
        adicionarEventosTabela();
    }

    // Gerencia as ações de aumentar, diminuir e remover itens
    function adicionarEventosTabela() {
        document.querySelectorAll('.btn-qtd').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                const acao = btn.getAttribute('data-acao');
                if (acao === 'aumentar') carrinho[index].quantidade += 1;
                else if (acao === 'diminuir' && carrinho[index].quantidade > 1) carrinho[index].quantidade -= 1;
                salvarEAtualizar();
            });
        });

        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', () => {
                carrinho.splice(btn.getAttribute('data-index'), 1);
                salvarEAtualizar();
            });
        });
    }

    function salvarEAtualizar() {
        localStorage.setItem('smartclothes_cart', JSON.stringify(carrinho));
        atualizarContadorVisual();
        renderizarCarrinho();
    }

    // Capta os cliques de "Adicionar" nas vitrines
    document.querySelectorAll('.product-card .btn-gold, .product-card button.btn-gold').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            const nome = card.querySelector('.product-title').innerText;
            const preco = card.querySelector('.product-price').innerText;

            const itemExistente = carrinho.find(item => item.nome === nome);
            if (itemExistente) {
                itemExistente.quantidade += 1;
            } else {
                carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
            }
            
            salvarEAtualizar();
            alert(`✨ ${nome} foi guardado no seu carrinho!`);
        });
    });

    // Finalização e pagamento simulado
    if (formPagamento) {
        formPagamento.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('💳 Pagamento efetuado com sucesso na Maison SmartClothes! Obrigado pela sua compra.');
            carrinho = [];
            salvarEAtualizar();
            window.location.href = 'index.html';
        });
    }

    // Inicialização automática
    atualizarContadorVisual();
    renderizarCarrinho();
});


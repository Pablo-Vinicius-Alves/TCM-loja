document.addEventListener('DOMContentLoaded', () => {
    let carrinho = JSON.parse(localStorage.getItem('smartclothes_cart')) || [];

    const contagemCarrinho = document.getElementById('contagem-carrinho');
    const tabelaItens = document.getElementById('itens-carrinho');
    const resumoSubtotal = document.getElementById('resumo-subtotal');
    const resumoTotal = document.getElementById('resumo-total');
    const painelCheckout = document.getElementById('painel-checkout');
    const formPagamento = document.getElementById('form-pagamento');

    function atualizarContadorVisual() {
        if (!contagemCarrinho) return;
        const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        contagemCarrinho.innerText = totalItens;
    }

    function renderizarCarrinho() {
        if (!tabelaItens) return;
        tabelaItens.innerHTML = '';

        // Se o carrinho estiver sem roupas, exibe o aviso customizado e oculta o cartão
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
                <td style="font-weight:600;">${item.nome}</td>
                <td>${item.preco}</td>
                <td>
                    <button class="btn-qtd" data-index="${index}" data-acao="diminuir">-</button>
                    <span class="qtd-valor">${item.quantidade}</span>
                    <button class="btn-qtd" data-index="${index}" data-acao="aumentar">+</button>
                </td>
                <td style="font-weight:600; color:var(--primaria);">R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td><button class="btn-remover" data-index="${index}">Excluir</button></td>
            `;
            tabelaItens.appendChild(tr);
        });

        if (resumoSubtotal) resumoSubtotal.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        if (resumoTotal) resumoTotal.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        
        adicionarEventosTabela();
    }

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

    // Escuta cliques nos botões de qualquer uma das duas vitrines
    document.querySelectorAll('.product-card .btn-gold').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            const nome = card.querySelector('.product-title').innerText;
            const preco = card.querySelector('.product-price').innerText;

            const itemExistente = carrinho.find(item => item.nome === nome);
            if (itemExistente) itemExistente.quantidade += 1;
            else carrinho.push({ nome, preco, quantity: 1, quantidade: 1 });
            
            salvarEAtualizar();
            alert(`✨ ${nome} foi guardado no seu carrinho!`);
        });
    });

    if (formPagamento) {
        formPagamento.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('💳 Compra efetuada com sucesso na Maison SmartClothes!');
            carrinho = [];
            salvarEAtualizar();
            window.location.href = 'index.html';
        });
    }

    atualizarContadorVisual();
    renderizarCarrinho();
});
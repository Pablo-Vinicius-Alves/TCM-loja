document.addEventListener('DOMContentLoaded', () => {
  // Carrega os itens salvos no navegador ou inicia uma lista vazia
  let listaCarrinho = JSON.parse(localStorage.getItem('smartclothes_cart')) || [];

  const contadorMenu = document.getElementById('contagem-carrinho');
  const tabelaItens = document.getElementById('lista-itens-carrinho');
  const textoSubtotal = document.getElementById('valor-subtotal');
  const textoPrazoEstimado = document.getElementById('prazo-estimado');
  const textoTotal = document.getElementById('valor-total');
  const painelFechamento = document.getElementById('painel-fechamento');
  const selecaoPagamento = document.getElementById('forma-pagamento');
  const areaNumeroCartao = document.getElementById('area-numero-cartao');
  const inputNumeroCartao = document.getElementById('numero-cartao');
  const formularioEncomenda = document.getElementById('formulario-encomenda');

  // Lista das peças que pertencem à Coleção de Inverno (3 dias úteis)
  const pecasInverno = ['Vestido de Seda Imperial', 'Vestido Cravejado'];

  // Descobre quantos dias úteis a peça leva para encomenda
  function descobrirPrazoDias(nomeRoupa) {
    if (pecasInverno.includes(nomeRoupa)) {
      return 3; // Coleção de Inverno: até 3 dias úteis
    }
    return 2; // Estilo para o Ano Todo: até 2 dias úteis
  }

  // Mostra ou esconde o campo do cartão conforme a forma de pagamento escolhida
  if (selecaoPagamento && areaNumeroCartao) {
    selecaoPagamento.addEventListener('change', () => {
      const escolheuCartao = selecaoPagamento.value.includes('Cartão');
      areaNumeroCartao.hidden = !escolheuCartao;
      if (inputNumeroCartao) inputNumeroCartao.required = escolheuCartao;
    });
  }

  // Atualiza o número de peças no menu superior
  function atualizarContadorMenu() {
    if (!contadorMenu) return;
    const totalPecas = listaCarrinho.reduce((soma, item) => soma + item.quantidade, 0);
    contadorMenu.innerText = totalPecas;
  }

  // Desenha as linhas da tabela na página do carrinho
  function desenharTabelaCarrinho() {
    if (!tabelaItens) return;
    tabelaItens.innerHTML = '';

    // Se estiver vazio, mostra aviso e esconde o resumo
    if (listaCarrinho.length === 0) {
      tabelaItens.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3.5rem; color: var(--roxo-acinzentado);">Seu carrinho está vazio! Escolha suas roupas em Início ou Coleções.</td></tr>`;
      if (painelFechamento) painelFechamento.style.display = 'none';
      return;
    }

    if (painelFechamento) painelFechamento.style.display = 'block';
    let somaGeral = 0;
    let maiorPrazo = 2;

    listaCarrinho.forEach((item, posicao) => {
      const precoNumero = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.').trim());
      const subtotalItem = precoNumero * item.quantidade;
      const diasPrazo = descobrirPrazoDias(item.nome);

      somaGeral += subtotalItem;
      if (diasPrazo > maiorPrazo) maiorPrazo = diasPrazo;

      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td style="font-weight: 600;">${item.nome}</td>
        <td><span class="etiqueta-prazo">Até ${diasPrazo} dias úteis</span></td>
        <td>${item.preco}</td>
        <td>
          <button class="botao-quantidade" data-posicao="${posicao}" data-acao="diminuir">-</button>
          <span class="numero-quantidade">${item.quantidade}</span>
          <button class="botao-quantidade" data-posicao="${posicao}" data-acao="aumentar">+</button>
        </td>
        <td style="font-weight: 600; color: var(--roxo-escuro);">R$ ${subtotalItem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td><button class="botao-excluir" data-posicao="${posicao}">Excluir</button></td>
      `;
      tabelaItens.appendChild(linha);
    });

    if (textoSubtotal) textoSubtotal.innerText = `R$ ${somaGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (textoPrazoEstimado) textoPrazoEstimado.innerText = `Até ${maiorPrazo} dias úteis`;
    if (textoTotal) textoTotal.innerText = `R$ ${somaGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    ativarBotoesTabela();
  }

  // Ativa os cliques nos botões de +, - e Excluir dentro da tabela
  function ativarBotoesTabela() {
    document.querySelectorAll('.botao-quantidade').forEach((botao) => {
      botao.addEventListener('click', () => {
        const posicao = botao.getAttribute('data-posicao');
        const acao = botao.getAttribute('data-acao');

        if (acao === 'aumentar') {
          listaCarrinho[posicao].quantidade += 1;
        } else if (acao === 'diminuir' && listaCarrinho[posicao].quantidade > 1) {
          listaCarrinho[posicao].quantidade -= 1;
        }
        salvarEAtualizar();
      });
    });

    document.querySelectorAll('.botao-excluir').forEach((botao) => {
      botao.addEventListener('click', () => {
        const posicao = botao.getAttribute('data-posicao');
        listaCarrinho.splice(posicao, 1);
        salvarEAtualizar();
      });
    });
  }

  // Salva a lista atualizada e atualiza a tela
  function salvarEAtualizar() {
    localStorage.setItem('smartclothes_cart', JSON.stringify(listaCarrinho));
    atualizarContadorMenu();
    desenharTabelaCarrinho();
  }

  // Faz os botões "Adicionar" do Início e de Coleções funcionarem
  document.querySelectorAll('.cartao-produto .botao-dourado').forEach((botao) => {
    botao.addEventListener('click', (evento) => {
      evento.preventDefault();
      const cartao = botao.closest('.cartao-produto');
      const nomeRoupa = cartao.querySelector('.nome-produto').innerText;
      const precoRoupa = cartao.querySelector('.preco-produto').innerText;

      const roupaJaExiste = listaCarrinho.find((item) => item.nome === nomeRoupa);
      if (roupaJaExiste) {
        roupaJaExiste.quantidade += 1;
      } else {
        listaCarrinho.push({ nome: nomeRoupa, preco: precoRoupa, quantidade: 1 });
      }

      salvarEAtualizar();
      alert(`${nomeRoupa} foi adicionado ao seu carrinho!`);
    });
  });

  // Finaliza o pagamento e confirma a encomenda
  if (formularioEncomenda) {
    formularioEncomenda.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const formaEscolhida = selecaoPagamento ? selecaoPagamento.value : 'PIX';
      const prazoFinal = textoPrazoEstimado ? textoPrazoEstimado.innerText : 'até 3 dias úteis';
      const valorFinal = textoTotal ? textoTotal.innerText : '';

      alert(`Pagamento via ${formaEscolhida} (${valorFinal}) confirmado!\nSua encomenda na SmartClothes ficará pronta em ${prazoFinal}.`);
      listaCarrinho = [];
      salvarEAtualizar();
      window.location.href = 'index.html';
    });
  }

  // Inicia o contador e a tabela assim que a página abre
  atualizarContadorMenu();
  desenharTabelaCarrinho();
});
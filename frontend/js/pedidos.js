import { ErroApi, formatarPreco, irParaLogin, listarPedidos } from './loja.js';
import { iniciarSessao } from './sessao.js';

const tabela = document.getElementById('tabela-pedidos');
const tbody = document.getElementById('lista-pedidos');
const aviso = document.getElementById('aviso-pedidos');

function formatarData(valor) {
  if (!valor) return '-';
  return new Date(valor).toLocaleDateString('pt-BR');
}

const usuario = await iniciarSessao();
if (!usuario) {
  irParaLogin();
} else {
  try {
    const pedidos = await listarPedidos();

    if (pedidos.length === 0) {
      aviso.textContent = 'Você ainda não realizou nenhuma compra.';
      aviso.hidden = false;
    } else {
      const linhas = pedidos.map((pedido) => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.innerHTML = `<strong>#${pedido.id_compra}</strong>`;

        const tdData = document.createElement('td');
        tdData.textContent = formatarData(pedido.data_compra);

        const tdEntrega = document.createElement('td');
        tdEntrega.textContent = formatarData(pedido.data_entrega_estimada);

        const tdTotal = document.createElement('td');
        tdTotal.textContent = formatarPreco(pedido.valor_total);

        const tdNf = document.createElement('td');
        if (pedido.id_nota_fiscal) {
          const linkNf = document.createElement('a');
          linkNf.href = `notaFiscal.html?id=${pedido.id_nota_fiscal}`;
          linkNf.className = 'botao-dourado';
          linkNf.style.padding = '6px 14px';
          linkNf.style.fontSize = '0.85rem';
          linkNf.textContent = pedido.numero_nf || 'Ver Nota';
          tdNf.append(linkNf);
        } else {
          tdNf.textContent = 'Indisponível';
        }

        tr.append(tdId, tdData, tdEntrega, tdTotal, tdNf);
        return tr;
      });

      tbody.replaceChildren(...linhas);
      tabela.hidden = false;
    }
  } catch (erro) {
    if (!(erro instanceof ErroApi)) throw erro;
    if (erro.status === 401) {
      irParaLogin();
    } else {
      aviso.textContent = `Não foi possível carregar seus pedidos. ${erro.message}`;
      aviso.hidden = false;
    }
  }
}
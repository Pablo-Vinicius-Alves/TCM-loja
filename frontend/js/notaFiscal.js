import { ErroApi, formatarCpf, formatarPreco, irParaLogin, obterNotaFiscal } from './loja.js';
import { iniciarSessao } from './sessao.js';

const $ = (id) => document.getElementById(id);
const aviso = $('aviso-nf');
const conteudo = $('conteudo-nf');

const usuario = await iniciarSessao();
if (!usuario) {
  irParaLogin();
} else {
  const idNf = new URLSearchParams(window.location.search).get('id');
  if (!idNf) {
    aviso.textContent = 'Nota fiscal não informada.';
    aviso.hidden = false;
  } else {
    try {
      const nf = await obterNotaFiscal(idNf);

      $('nf-tipo').textContent = nf.tipo_documento;
      $('nf-numero').textContent = nf.numero_nf;
      $('nf-status').textContent = nf.status_nf;
      $('nf-cliente').textContent = nf.cliente_nome;
      $('nf-cpf').textContent = formatarCpf(nf.cliente_cpf);
      $('nf-email').textContent = nf.cliente_email;
      $('nf-pedido').textContent = nf.id_compra;
      $('nf-emissao').textContent = new Date(nf.data_emissao).toLocaleString('pt-BR');
      $('nf-entrega').textContent = nf.data_entrega_estimada
        ? new Date(nf.data_entrega_estimada).toLocaleDateString('pt-BR')
        : 'A confirmar';
      $('nf-total').textContent = formatarPreco(nf.valor_total_nf);

      const linhas = nf.itens.map((item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.nome}</td>
          <td>${item.quantidade}</td>
          <td>${formatarPreco(item.preco_unitario)}</td>
          <td>${formatarPreco(item.subtotal)}</td>
        `;
        return tr;
      });
      $('nf-itens').replaceChildren(...linhas);
      conteudo.hidden = false;
    } catch (erro) {
      if (!(erro instanceof ErroApi)) throw erro;
      if (erro.status === 401) irParaLogin();
      else {
        aviso.textContent = erro.message;
        aviso.hidden = false;
      }
    }
  }
}

$('btn-imprimir')?.addEventListener('click', () => window.print());
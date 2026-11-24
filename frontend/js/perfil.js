import {
  ErroApi,
  atualizarMeuPerfil,
  formatarCpf,
  irParaLogin,
  obterMeuPerfil
} from './loja.js';
import { iniciarSessao } from './sessao.js';

const form = document.getElementById('form-perfil');
const aviso = document.getElementById('aviso-perfil');
const sucesso = document.getElementById('sucesso-perfil');
const btnSalvar = document.getElementById('btn-salvar-perfil');

const campoNome = document.getElementById('perfil-nome');
const campoCpf = document.getElementById('perfil-cpf');
const campoEmail = document.getElementById('perfil-email');
const campoTelefone = document.getElementById('perfil-telefone');
const campoEndereco = document.getElementById('perfil-endereco');

function preencherFormulario(dados) {
  campoNome.value = dados.nome ?? '';
  campoCpf.value = formatarCpf(dados.cpf ?? '');
  campoEmail.value = dados.email ?? '';
  campoTelefone.value = dados.telefone ?? '';
  campoEndereco.value = dados.endereco ?? '';
}

async function carregarPerfil() {
  const usuario = await iniciarSessao();
  if (!usuario) {
    irParaLogin();
    return;
  }

  try {
    const perfil = await obterMeuPerfil();
    preencherFormulario(perfil);
    form.hidden = false;
  } catch (erro) {
    if (!(erro instanceof ErroApi)) throw erro;
    if (erro.status === 401) {
      irParaLogin();
      return;
    }
    aviso.textContent = erro.message;
    aviso.hidden = false;
  }
}

await carregarPerfil();

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  aviso.hidden = true;
  sucesso.hidden = true;
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  try {
    const atualizado = await atualizarMeuPerfil({
      nome: campoNome.value,
      email: campoEmail.value,
      telefone: campoTelefone.value,
      endereco: campoEndereco.value
    });
    preencherFormulario(atualizado);
    sucesso.hidden = false;
  } catch (erro) {
    if (!(erro instanceof ErroApi)) throw erro;
    if (erro.status === 401) {
      irParaLogin();
      return;
    }
    const detalhe = erro.detalhes?.length ? ` (${erro.detalhes.join(', ')})` : '';
    aviso.textContent = `${erro.message}${detalhe}`;
    aviso.hidden = false;
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar alterações';
  }
});
import { api, ApiError } from './api.js';
import { mostrarAlerta, esconderAlerta, formatarCpf } from './ui.js';
 
const PAGINA_INICIAL = '/pages/painel.html';
 
const $ = (id) => document.getElementById(id);
const alerta = $('alerta');
 
const abas = {
  entrar: { aba: $('aba-entrar'), form: $('form-entrar') },
  criar: { aba: $('aba-criar'), form: $('form-criar') }
};
 
api('/auth/me', { redirecionar401: false })
  .then(() => window.location.replace(PAGINA_INICIAL))
  .catch(() => {});

function selecionarAba(nome, { limparAlerta = true } = {}) {
  for (const [chave, { aba, form }] of Object.entries(abas)) {
    const ativa = chave === nome;
    aba.setAttribute('aria-selected', String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
    form.hidden = !ativa;
  }
  if (limparAlerta) esconderAlerta(alerta);
}
 
for (const [chave, { aba }] of Object.entries(abas)) {
  aba.addEventListener('click', () => selecionarAba(chave));
 
  aba.addEventListener('keydown', (evento) => {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
    const outra = chave === 'entrar' ? 'criar' : 'entrar';
    selecionarAba(outra);
    abas[outra].aba.focus();
  });
}
async function enviar(botao, acao) {
  esconderAlerta(alerta);
  botao.disabled = true;
  try {
    await acao();
  } catch (erro) {
    if (!(erro instanceof ApiError)) throw erro;
    mostrarAlerta(alerta, erro.message, 'erro', erro.detalhes);
  } finally {
    botao.disabled = false;
  }
}
 
abas.entrar.form.addEventListener('submit', (evento) => {
  evento.preventDefault();
 
  enviar($('btn-entrar'), async () => {
    await api('/auth/login', {
      method: 'POST',
      redirecionar401: false,
      body: { usuario: $('login-usuario').value, senha: $('login-senha').value }
    });
    window.location.href = PAGINA_INICIAL;
  });
});
 
abas.criar.form.addEventListener('submit', (evento) => {
  evento.preventDefault();
 
  if ($('reg-senha').value !== $('reg-confirmar').value) {
    mostrarAlerta(alerta, 'As senhas não conferem.');
    return;
  }
 
  enviar($('btn-criar'), async () => {
    const dados = {
      nome: $('reg-nome').value,
      email: $('reg-email').value,
      cpf: $('reg-cpf').value,
      telefone: $('reg-telefone').value,
      endereco: $('reg-endereco').value,
      usuario: $('reg-usuario').value,
      senha: $('reg-senha').value
    };
 
    const resposta = await api('/auth/registrar', {
      method: 'POST',
      redirecionar401: false,
      body: dados
    });

    selecionarAba('entrar');
    $('login-usuario').value = dados.usuario.trim().toLowerCase();
    $('login-senha').value = '';
    $('login-senha').focus();
    mostrarAlerta(alerta, resposta.mensagem, 'sucesso');
  });
});
 
$('reg-cpf').addEventListener('input', () => {
  $('reg-cpf').value = formatarCpf($('reg-cpf').value);
});
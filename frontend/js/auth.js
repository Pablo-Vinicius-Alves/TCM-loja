import { api, ApiError } from './api.js';

const paginaInicial = '/pages/paginainicial.html'; // Falta criar esse arquivo html

const $ = (id) => document.getElementById(id);

const abas = {
    entrar: { aba: $('aba-entrar'), form: $('form-entrar') },
    criar: { aba: $('aba-criar'), form: $('form-criar') }
};

api('/auth/perfil', { redirecionar401: false })
    .then(() => window.location.replace(paginaInicial))
    .catch(() => { });

function selectAba(nome) {
    for (const [chave, { aba, form }] of Object.entries(abas)) {
        const ativa = chave === nome;

        aba.classList.toggle('active', ativa);
        aba.setAttribute('aria-selected', String(ativa));
        aba.tabIndex = ativa ? 0 : -1;
        form.hidden = !ativa;
    }
}

for (const [chave, { aba }] of Object.entries(abas)) {
    aba.addEventListener('click', () => selectAba(chave));

    aba.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        const outra = chave === 'entrar' ? 'criar' : 'entrar';
        selectAba(outra);
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
 
abas.entrar.form.addEventListener('submit', (event) => {
  event.preventDefault();
 
  enviar($('btn-entrar'), async () => {
    await api('/auth/login', {
      method: 'POST',
      redirecionar401: false,
      body: { usuario: $('login-usuario').value, senha: $('login-senha').value }
    });
    window.location.href = paginaInicial;
  });
});
 
abas.criar.form.addEventListener('submit', (event) => {
  event.preventDefault();
 
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
 
    abas.criar.form.reset();
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
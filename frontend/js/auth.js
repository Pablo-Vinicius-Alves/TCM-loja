import {
  ErroApi, 
  PAGINA_INICIAL, 
  entrar, 
  registrar, 
  obterUsuario, 
  formatarCpf
} from './loja.js';

const $ = (id) => document.getElementById(id);
const abaLogin = $('btn-login');
const abaCadastro = $('btn-cadastro');
const painelLogin = $('painel-login');
const painelCadastro = $('painel-cadastro');
const caixa = $('caixa-alerta');

function mostrarAlerta(texto, { detalhes = [], tipo = 'erro' } = {}) {
  caixa.replaceChildren();
  caixa.classList.toggle('caixa-alerta--ok', tipo === 'ok');

  const titulo = document.createElement('strong');
  titulo.textContent = texto;
  caixa.append(titulo);

  if (detalhes.length) {
    const lista = document.createElement('ul');
    for (const d of detalhes) {
      const item = document.createElement('li');
      item.textContent = d;
      lista.append(item);
    }
    caixa.append(lista);
  }
  caixa.hidden = false;
}
const esconderAlerta = () => { caixa.hidden = true; caixa.replaceChildren(); };

function mostrarErro(erro) {
  if (!(erro instanceof ErroApi)) throw erro;
  mostrarAlerta(erro.message, { detalhes: erro.detalhes });
}

function mostrarAba(qual) {
  const login = qual === 'login';
  painelLogin.hidden = !login;
  painelCadastro.hidden = login;
  abaLogin.className = login ? 'botao-principal' : 'botao-dourado';
  abaCadastro.className = login ? 'botao-dourado' : 'botao-principal';
  esconderAlerta();
}
abaLogin.addEventListener('click', () => mostrarAba('login'));
abaCadastro.addEventListener('click', () => mostrarAba('cadastro'));

$('formulario-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const usuario = $('campo-usuario-login').value.trim();
  const senha = $('campo-senha-login').value;
  if (!usuario || !senha) return mostrarAlerta('Informe usuário e senha.');

  const botao = $('botao-entrar');
  botao.disabled = true;
  try {
    await entrar(usuario, senha);
    window.location.assign(PAGINA_INICIAL);
  } catch (erro) {
    botao.disabled = false;
    mostrarErro(erro);
  }
});

$('cadastro-cpf').addEventListener('input', (evento) => {
  evento.target.value = formatarCpf(evento.target.value);
});

$('formulario-cadastro').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const senha = $('cadastro-senha').value;
  if (senha !== $('cadastro-confirmar').value) return mostrarAlerta('As senhas não conferem.');

  const botao = $('botao-cadastrar');
  botao.disabled = true;
  try {
    await registrar({
      nome: $('cadastro-nome').value,
      email: $('cadastro-email').value,
      cpf: $('cadastro-cpf').value,
      telefone: $('cadastro-telefone').value,
      endereco: $('cadastro-endereco').value,
      usuario: $('cadastro-usuario').value,
      senha
    });

    const usuario = $('cadastro-usuario').value.trim().toLowerCase();
    $('formulario-cadastro').reset();
    mostrarAba('login');
    $('campo-usuario-login').value = usuario;
    $('campo-senha-login').focus();
    mostrarAlerta('Conta criada! Digite sua senha para entrar.', { tipo: 'ok' });
  } catch (erro) {
    mostrarErro(erro);
  } finally {
    botao.disabled = false;
  }
});

try {
  if (await obterUsuario()) window.location.replace(PAGINA_INICIAL);
} catch {}
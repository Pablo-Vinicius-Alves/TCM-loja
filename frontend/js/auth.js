import { api, ApiError } from './api.js';

const paginaInicial = '/frontend/pages/index.html';
const $ = (id) => document.getElementById(id);

async function enviar(botao, acao) {
  const alerta = $('alerta');
  esconderAlerta(alerta);
  if (botao) botao.disabled = true;

  try {
    await acao();
  } catch (erro) {
    if (erro instanceof ApiError) {
      mostrarAlerta(alerta, erro.message, 'erro', erro.detalhes);
    } else {
      mostrarAlerta(alerta, 'Ocorreu um erro inesperado. Tente novamente.', 'erro');
      console.error(erro);
    }
  } finally {
    if (botao) botao.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const formEntrar = $('form-entrar');
  const formCriar = $('form-criar');

  api('/auth/perfil', { redirecionar401: false })
    .then(() => window.location.replace(paginaInicial))
    .catch(() => {});

  if (formEntrar) {
    const usuarioSalvo = localStorage.getItem('login_usuario_temp');
    if (usuarioSalvo) {
      const campoUsuario = $('login-usuario');
      if (campoUsuario) {
        campoUsuario.value = usuarioSalvo;
        $('login-senha')?.focus();
      }
      localStorage.removeItem('login_usuario_temp');
    }

    formEntrar.addEventListener('submit', (event) => {
      event.preventDefault();

      enviar($('btn-entrar'), async () => {
        await api('/auth/login', {
          method: 'POST',
          redirecionar401: false,
          body: {
            usuario: $('login-usuario').value,
            senha: $('login-senha').value
          }
        });
        window.location.href = paginaInicial;
      });
    });
  }

  if (formCriar) {
    const campoCpf = $('reg-cpf');
    if (campoCpf) {
      campoCpf.addEventListener('input', () => {
        campoCpf.value = formatarCpf(campoCpf.value);
      });
    }

    formCriar.addEventListener('submit', (event) => {
      event.preventDefault();

      const senha = $('reg-senha').value;
      const confirmar = $('reg-confirmar').value;

      if (senha !== confirmar) {
        mostrarAlerta($('alerta'), 'As senhas não conferem.');
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
          senha: senha
        };

        await api('/auth/registrar', {
          method: 'POST',
          redirecionar401: false,
          body: dados
        });

        localStorage.setItem('login_usuario_temp', dados.usuario.trim().toLowerCase());
        window.location.href = 'login.html';
      });
    });
  }
});
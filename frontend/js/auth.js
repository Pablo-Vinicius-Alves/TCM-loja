import { chamarApi } from './api.js';

function mostrarAlerta(mensagem, tipo = 'erro') {
    const caixaAlerta = document.getElementById('caixa-alerta');

    if (!caixaAlerta) return;

    caixaAlerta.hidden = false;
    caixaAlerta.innerText = mensagem;

    if (tipo === 'sucesso') {
        caixaAlerta.style.backgroundColor = 'var(--verde-claro)';
        caixaAlerta.style.borderColor = 'var(--verde-escuro)';
        caixaAlerta.style.color = 'var(--verde-escuro)';
    } else {
        caixaAlerta.style.backgroundColor = 'var(--rosa-claro)';
        caixaAlerta.style.borderColor = 'var(--vermelho-vinho)';
        caixaAlerta.style.color = 'var(--vermelho-vinho)';
    }
}

function esconderAlerta() {
    const caixaAlerta = document.getElementById('caixa-alerta');

    if (!caixaAlerta) return;

    caixaAlerta.hidden = true;
    caixaAlerta.innerText = '';
}

document.addEventListener('DOMContentLoaded', () => {

    const btnLogin = document.getElementById('btn-login');
    const btnCadastro = document.getElementById('btn-cadastro');

    const painelLogin = document.getElementById('painel-login');
    const painelCadastro = document.getElementById('painel-cadastro');

    if (btnLogin && btnCadastro && painelLogin && painelCadastro) {

        btnLogin.addEventListener('click', () => {
            esconderAlerta();

            painelLogin.hidden = false;
            painelCadastro.hidden = true;

            btnLogin.classList.remove('botao-dourado');
            btnLogin.classList.add('botao-principal');

            btnCadastro.classList.remove('botao-principal');
            btnCadastro.classList.add('botao-dourado');
        });

        btnCadastro.addEventListener('click', () => {
            esconderAlerta();

            painelLogin.hidden = true;
            painelCadastro.hidden = false;

            btnCadastro.classList.remove('botao-dourado');
            btnCadastro.classList.add('botao-principal');

            btnLogin.classList.remove('botao-principal');
            btnLogin.classList.add('botao-dourado');
        });
    }

    const inputCpf = document.getElementById('cadastro-cpf');

    if (inputCpf) {
        inputCpf.addEventListener('input', () => {
            let valor = inputCpf.value.replace(/\D/g, '').slice(0, 11);

            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            inputCpf.value = valor;
        });
    }

    const formularioCadastro = document.getElementById('formulario-cadastro');

    if (formularioCadastro) {
        formularioCadastro.addEventListener('submit', async (evento) => {

            evento.preventDefault();

            const nome = document.getElementById('cadastro-nome').value.trim();
            const email = document.getElementById('cadastro-email').value.trim();
            const cpf = document.getElementById('cadastro-cpf').value.trim();
            const telefone = document.getElementById('cadastro-telefone').value.trim();
            const endereco = document.getElementById('cadastro-endereco').value.trim();
            const usuario = document
                .getElementById('cadastro-usuario')
                .value
                .trim()
                .toLowerCase();

            const senha = document.getElementById('cadastro-senha').value;
            const confirmarSenha = document.getElementById('cadastro-confirmar').value;

            if (!nome || !email || !cpf || !usuario || !senha) {
                mostrarAlerta(
                    'Preencha todos os campos obrigatórios (Nome, E-mail, CPF, Usuário e Senha).'
                );
                return;
            }

            if (usuario.length < 3 || !/^[a-z0-9._-]+$/.test(usuario)) {
                mostrarAlerta(
                    'O usuário deve ter de 3 a 50 caracteres (apenas letras sem acento, números, ponto, hífen ou _).'
                );
                return;
            }

            if (
                senha.length < 8 ||
                !/[a-zA-Z]/.test(senha) ||
                !/\d/.test(senha)
            ) {
                mostrarAlerta(
                    'A senha precisa ter pelo menos 8 caracteres, misturando letras e números.'
                );
                return;
            }

            if (senha !== confirmarSenha) {
                mostrarAlerta(
                    'As duas senhas digitadas não conferem.'
                );
                return;
            }

            const botaoCadastrar = document.getElementById('botao-cadastrar');

            if (botaoCadastrar) {
                botaoCadastrar.disabled = true;
            }

            try {

                const resposta = await chamarApi('/auth/registrar', {
                    metodo: 'POST',
                    corpo: {
                        nome,
                        email,
                        cpf,
                        telefone,
                        endereco,
                        usuario,
                        senha
                    },
                    redirecionar401: false
                });

                mostrarAlerta(
                    resposta.mensagem || 'Conta criada com sucesso!',
                    'sucesso'
                );

                setTimeout(() => {

                    painelCadastro.hidden = true;
                    painelLogin.hidden = false;

                    formularioCadastro.reset();

                    document.getElementById('campo-usuario-login').value = usuario;

                    btnLogin.click();

                    mostrarAlerta(
                        'Conta criada com sucesso. Faça login para continuar.',
                        'sucesso'
                    );

                }, 1200);

            } catch (erro) {

                mostrarAlerta(
                    erro.message || 'Não foi possível concluir o cadastro.'
                );

            } finally {

                if (botaoCadastrar) {
                    botaoCadastrar.disabled = false;
                }
            }
        });
    }

    const formularioLogin = document.getElementById('formulario-login');

    if (formularioLogin) {

        formularioLogin.addEventListener('submit', async (evento) => {

            evento.preventDefault();

            const usuario = document
                .getElementById('campo-usuario-login')
                .value
                .trim()
                .toLowerCase();

            const senha = document
                .getElementById('campo-senha-login')
                .value;

            if (!usuario || !senha) {
                mostrarAlerta(
                    'Informe seu usuário e sua senha.'
                );
                return;
            }

            const botaoEntrar = document.getElementById('botao-entrar');

            if (botaoEntrar) {
                botaoEntrar.disabled = true;
            }

            try {

                const resposta = await chamarApi('/auth/login', {
                    metodo: 'POST',
                    corpo: {
                        usuario,
                        senha
                    },
                    redirecionar401: false
                });

                localStorage.setItem(
                    'smartclothes_cliente',
                    JSON.stringify(resposta.cliente)
                );

                window.location.href = 'index.html';

            } catch (erro) {

                mostrarAlerta(
                    erro.message || 'Usuário ou senha inválidos.'
                );

            } finally {

                if (botaoEntrar) {
                    botaoEntrar.disabled = false;
                }
            }
        });
    }

    const dadosSalvos = localStorage.getItem('smartclothes_cliente');
    const linkLoginMenu = document.querySelector(
        'header nav a[href="auth.html"]'
    );

    if (dadosSalvos && linkLoginMenu) {

        const cliente = JSON.parse(dadosSalvos);
        const primeiroNome = cliente.nome.split(' ')[0];

        linkLoginMenu.innerText = `Olá, ${primeiroNome} (Sair)`;
        linkLoginMenu.href = '#';

        linkLoginMenu.addEventListener('click', async (evento) => {

            evento.preventDefault();

            await chamarApi('/auth/logout', {
                metodo: 'POST',
                redirecionar401: false
            }).catch(() => null);

            localStorage.removeItem('smartclothes_cliente');

            window.location.href = 'auth.html';
        });
    }
});
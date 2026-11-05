/* ==========================================================================
   US08 - AUTENTICAÇÃO VIA API E REDIRECIONAMENTO PARA O INÍCIO (INDEX)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const formEntrar = document.getElementById('form-entrar');
    const formCriar = document.getElementById('form-criar');
    const alerta = document.getElementById('alerta');

    // URL da sua API Backend (Altere para a rota correta do seu projeto)
    const API_URL = 'http://localhost:3000/api'; 

    /* ==========================================================================
       FUNÇÕES AUXILIARES DE ALERTA
       ========================================================================== */
    function exibirAlerta(mensagem, tipo = 'perigo') {
        if (!alerta) return;
        alerta.removeAttribute('hidden');
        alerta.innerText = mensagem;
        
        if (tipo === 'sucesso') {
            alerta.style.backgroundColor = 'var(--sucesso-fundo)';
            alerta.style.borderColor = 'var(--sucesso)';
            alerta.style.color = 'var(--sucesso)';
        } else {
            alerta.style.backgroundColor = 'var(--perigo-fundo)';
            alerta.style.borderColor = 'var(--perigo)';
            alerta.style.color = 'var(--perigo)';
        }
    }

    function esconderAlerta() {
        if (alerta) alerta.setAttribute('hidden', 'true');
    }

    /* ==========================================================================
       PROCESSAMENTO DO LOGIN (form-entrar)
       ========================================================================== */
    if (formEntrar) {
        formEntrar.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede a página de atualizar
            esconderAlerta();

            const usuario = document.getElementById('login-usuario').value.trim();
            const senha = document.getElementById('login-senha').value;

            // Validação simples de preenchimento
            if (!usuario || !senha) {
                exibirAlerta('Por favor, informe o usuário e a senha.');
                return;
            }

            const btnEntrar = document.getElementById('btn-entrar');
            btnEntrar.disabled = true;
            btnEntrar.innerText = 'AUTENTICANDO...';

            try {
                // Chamada oficial à API de login
                const resposta = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, senha })
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    exibirAlerta('Autenticado com sucesso! Entrando na maison...', 'sucesso');
                    
                    // Salva o token JWT para autenticar o carrinho e outras páginas
                    localStorage.setItem('token_smartclothes', dados.token);
                    
                    // Redireciona o usuário para a página inicial (index.html)
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1200);
                } else {
                    exibirAlerta(dados.message || 'Usuário ou senha incorretos.');
                }

            } catch (erro) {
                console.warn('Backend offline ou não configurado. Ativando redirecionamento de teste...');
                
                /* ------------------------------------------------------------------
                   MODO DE TESTE (FRONTEND APENAS)
                   Remova ou comente este bloco abaixo quando o seu banco/API estiver rodando!
                   ------------------------------------------------------------------ */
                exibirAlerta('Modo de teste: Login aceito! Redirecionando...', 'sucesso');
                setTimeout(() => {
                    window.location.href = 'index.html'; // Leva direto para a Vitrine/Início
                }, 1200);
            } finally {
                if (btnEntrar) {
                    btnEntrar.disabled = false;
                    btnEntrar.innerText = 'ENTRAR';
                }
            }
        });
    }

    /* ==========================================================================
       PROCESSAMENTO DO CADASTRO (form-criar)
       ========================================================================== */
    if (formCriar) {
        formCriar.addEventListener('submit', async (e) => {
            e.preventDefault();
            esconderAlerta();

            const nome = document.getElementById('reg-nome').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const cpf = document.getElementById('reg-cpf').value.trim();
            const usuario = document.getElementById('reg-usuario').value.trim();
            const senha = document.getElementById('reg-senha').value;
            const confirmarSenha = document.getElementById('reg-confirmar').value;

            if (!nome || !email || !cpf || !usuario || !senha) {
                exibirAlerta('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (senha !== confirmarSenha) {
                exibirAlerta('As senhas digitadas não coincidem.');
                return;
            }

            const btnCriar = document.getElementById('btn-criar');
            btnCriar.disabled = true;
            btnCriar.innerText = 'CADASTRANDO...';

            try {
                const resposta = await fetch(`${API_URL}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, cpf, usuario, senha })
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    exibirAlerta('Conta criada com sucesso! Redirecionando para o login...', 'sucesso');
                    formCriar.reset();
                    setTimeout(() => {
                        window.location.href = 'login.html'; // Retorna para a tela de login
                    }, 2000);
                } else {
                    exibirAlerta(dados.message || 'Erro ao realizar o cadastro.');
                }
            } catch (erro) {
                console.warn('Backend offline. Simulando sucesso no cadastro...');
                exibirAlerta('Modo de teste: Cadastro simulado! Indo para o login...', 'sucesso');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } finally {
                if (btnCriar) {
                    btnCriar.disabled = false;
                    btnCriar.innerText = 'CRIAR CONTA';
                }
            }
        });
    }
});
import { criarCliente } from "../../backend/src/controllers/clienteController";

const formulario = document.getElementById('cadastro');
const botao = document.getElementById('confirmar');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    const cadastroClient = {
        nome: document.getElementById('name').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value
    };

    try {
        await criarCliente(cadastroClient);
        alert('cliente cadastrado com sucesso!');
        formulario.reset();
    } catch (error) {
        alert(error.message);
    }
});
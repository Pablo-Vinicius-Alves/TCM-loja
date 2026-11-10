import { mostrarAlerta } from "./ui.js";
import { api, ApiError } from "./api";

const $ = (id) => document.getElementById(id);

try{
    const perfil = await api('/auth/perfil');

    $('Boas vindas').textContent = perfil.nome.split(' ')[0];
} catch{};
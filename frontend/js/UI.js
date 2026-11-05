export const soDigitos = (texto) => String(texto ?? '').replace(/\D/g, '');

export function formatarCpf(valor) {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function mostrarAlerta(caixa, texto, tipo = 'erro', detalhes = []) {
  caixa.replaceChildren();
  caixa.className = `alerta alerta--${tipo}`;
 
  const titulo = document.createElement('strong');
  titulo.textContent = texto;
  caixa.append(titulo);
 
  if (detalhes.length) {
    const lista = document.createElement('ul');
    for (const detalhe of detalhes) {
      const item = document.createElement('li');
      item.textContent = detalhe;
      lista.append(item);
    }
    caixa.append(lista);
  }
 
  caixa.hidden = false;
}
 
export function esconderAlerta(caixa) {
  caixa.hidden = true;
}
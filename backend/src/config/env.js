import 'dotenv/config';

const obrigatorias = ['DB_HOST', 'DB_NAME', 'DB_USER'];
const faltando = obrigatorias.filter((nome) => !process.env[nome]);

if (faltando.length > 0) {
  console.error(`Variáveis ausentes no .env: ${faltando.join(', ')}`);
  process.exit(1);
}
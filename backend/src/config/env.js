import 'dotenv/config';

const obrigatorias = ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET'];
const faltando = obrigatorias.filter((nome) => !process.env[nome]);

if (faltando.length) {
  console.error(`Variáveis ausentes no .env: ${faltando.join(', ')}`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET precisa ter pelo menos 32 caracteres. Gere um com:\n'
  );
}
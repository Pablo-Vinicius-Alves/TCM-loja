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

export const env = {
  port: Number(process.env.PORT) || 3000,
  producao: process.env.NODE_ENV === 'production',
  jwt: {                                 
    secret: process.env.JWT_SECRET,
    expiraEmHoras: 2
  },
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME
  }
};
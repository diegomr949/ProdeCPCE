require('dotenv').config();

const config = {
  // Servidor
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_SSL: process.env.DB_SSL,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'tu_secret_muy_largo_aqui',
  JWT_EXPIRE: '30d',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

// Validar variables requeridas
const required = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`⚠️  Variable ${key} no está configurada`);
  }
}

module.exports = config;
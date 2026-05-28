const express = require('express');
const cors = require('cors');
const config = require('./config/env');

// Importar rutas
const authRoutes = require('./routes/auth');
const partidosRoutes = require('./routes/partidos');
// ... más rutas

const app = express();

// Middlewares
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api', authRoutes);
app.use('/api', partidosRoutes);
// ... más rutas

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    error: true, 
    code: 500, 
    data: { error: err.message } 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: true, 
    code: 404, 
    data: { error: 'Ruta no encontrada' } 
  });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
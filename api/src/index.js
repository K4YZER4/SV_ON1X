require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const pool = require('./db');
require('./jobs/actualizarPois');

const app = express();
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ status: 'error', detalle: e.message });
  }
});

// Todas las rutas
app.use('/api', require('./routes/index'));

// Error handler global (debe ir al final)
app.use(require('./middlewares/errorHandler'));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Urbango API corriendo en :${PORT}`));

process.on('SIGTERM', () => server.close(() => pool.end()));

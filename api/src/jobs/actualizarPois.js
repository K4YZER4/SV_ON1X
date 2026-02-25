const cron = require('node-cron');
const axios = require('axios');
const env   = require('../config/env');

// Día 1 de cada mes a las 3:00am — mismo schedule que el Dockerfile.cron anterior
cron.schedule('0 3 1 * *', async () => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [CRON] Iniciando actualización de POIs...`);
  try {
    const { data } = await axios.get(`http://localhost:${env.port}/api/rutas-pois`, {
      params: { actualizar: true, intervalometros: 700, poislimit: 5 }
    });
    console.log(`[CRON] ✅ POIs actualizados. Total: ${data.total}`);
  } catch (e) {
    console.error(`[CRON] ❌ Error actualizando POIs:`, e.message);
  }
});

console.log('[CRON] Job registrado: actualización de POIs el día 1 de cada mes a las 3am');

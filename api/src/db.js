const { Pool } = require('pg');
const env = require('./config/env');

const pool = new Pool({
  host:                   env.db.host,
  port:                   env.db.port,
  database:               env.db.name,
  user:                   env.db.user,
  password:               env.db.pass,
  min:                    env.db.poolMin,
  max:                    env.db.poolMax,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis:       30000,
});

// Verifica la conexión al arrancar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅ Conectado a PostgreSQL');
    release();
  }
});

module.exports = pool;

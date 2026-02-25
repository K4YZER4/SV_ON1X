require('dotenv').config();

module.exports = {
  db: {
    host:     process.env.DB_HOST     || 'db',
    port:     parseInt(process.env.DB_PORT || '5432'),
    name:     process.env.DB_NAME,
    user:     process.env.DB_USER,
    pass:     process.env.DB_PASS,
    poolMin:  parseInt(process.env.DB_POOL_MIN || '1'),
    poolMax:  parseInt(process.env.DB_POOL_MAX || '100'),
  },
  google: {
    placesKey:     process.env.GOOGLE_PLACES_API_KEY,
    directionsKey: process.env.GOOGLE_PLACES_API_KEY, // misma key
  },
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

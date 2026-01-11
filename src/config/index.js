require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const dbDialect = process.env.DB_DIALECT || (env === 'test' ? 'sqlite' : 'postgres');
const dbNameByEnv = {
  development: 'mini_crm_dev',
  test: 'mini_crm_test',
  production: 'mini_crm',
};

module.exports = {
  app: {
    port: process.env.APP_PORT || 3000,
    env,
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    database:
      process.env.DB_NAME ||
      (dbDialect === 'sqlite' ? 'sqlite' : dbNameByEnv[env] || 'mini_crm'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || null,
    dialect: dbDialect,
    storage: process.env.DB_STORAGE || ':memory:',
    logging: process.env.DB_LOGGING === 'true',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    traceIdHeader: process.env.TRACE_ID_HEADER || 'X-Trace-Id',
    slowRequestMs: parseInt(process.env.SLOW_REQUEST_MS, 10) || 500,
  },
};

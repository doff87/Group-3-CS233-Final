require('dotenv').config();

const hasPostgres = !!(process.env.PG_HOST || process.env.PG_DATABASE || process.env.PG_USER || process.env.PG_DB);

module.exports = {
  development: hasPostgres ? {
    username: process.env.PG_USER || process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || process.env.PG_PASS || null,
    database: process.env.PG_DATABASE || process.env.PG_DB || 'foodie_dev',
    host: process.env.PG_HOST || '127.0.0.1',
    port: process.env.PG_PORT || 5432,
    dialect: process.env.PG_DIALECT || 'postgres',
    logging: false,
  } : {
    dialect: 'sqlite',
    storage: './server.sqlite',
    logging: false,
  },
  test: {
    username: process.env.PG_USER || process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || process.env.PG_PASS || null,
    database: process.env.PG_DATABASE || process.env.PG_DB || 'foodie_test',
    host: process.env.PG_HOST || '127.0.0.1',
    port: process.env.PG_PORT || 5432,
    dialect: process.env.PG_DIALECT || 'postgres',
    logging: false,
  },
  production: {
    username: process.env.PG_USER || process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD || process.env.PG_PASS,
    database: process.env.PG_DATABASE || process.env.PG_DB,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    dialect: process.env.PG_DIALECT || 'postgres',
    logging: false,
  }
};

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const DB_HOST = process.env.PG_HOST;
const DB_PORT = process.env.PG_PORT || 5432;
const DB_NAME = process.env.PG_DATABASE || process.env.PG_DB;
const DB_USER = process.env.PG_USER || process.env.PG_USERNAME;
const DB_PASS = process.env.PG_PASSWORD || process.env.PG_PASS;

let sequelize;
// If Postgres env vars are provided, use Postgres. Otherwise fall back to SQLite for local dev.
if (DB_HOST || DB_NAME || DB_USER) {
  sequelize = new Sequelize(DB_NAME || 'foodie', DB_USER || 'postgres', DB_PASS || '', {
    host: DB_HOST || 'localhost',
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
  });
} else {
  // Lightweight local fallback for development and CI where Postgres isn't available.
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './server.sqlite',
    logging: false,
  });
}

export default sequelize;

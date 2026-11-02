
const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool({
  ...(env.DATABASE_URL
    ? { connectionString: env.DATABASE_URL }
    : {
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
      }),

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,

  ...(env.DB_SSL
    ? { ssl: { rejectUnauthorized: true } }
    : {}),
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

const query = (text, params) => pool.query(text, params);

const testDatabaseConnection = async () => {
  const result = await query("SELECT NOW()");
  return result.rows[0];
};

module.exports = {
  pool,
  query,
  testDatabaseConnection,
};

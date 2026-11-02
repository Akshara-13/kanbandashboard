
const app = require("./app");
const env = require("./config/env");
const { pool } = require("./config/db");
const { initializeSocket } = require("./config/socket");

const server = app.listen(env.PORT, () => {
  console.log(`Kanban API running at http://localhost:${env.PORT}`);
});

// Initialize Socket.IO
initializeSocket(server);

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await pool.end();
      console.log("PostgreSQL pool closed");
      process.exitCode = 0;
    } catch (error) {
      console.error("Error closing PostgreSQL pool:", error);
      process.exitCode = 1;
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

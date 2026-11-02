
const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z.string().optional(),

  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default("kanban_db"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default(""),

  DB_SSL: z.enum(["true", "false"]).default("false"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  TRUST_PROXY: z.enum(["true", "false"]).default("false"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = {
  ...parsedEnv.data,
  DB_SSL: parsedEnv.data.DB_SSL === "true",
  TRUST_PROXY: parsedEnv.data.TRUST_PROXY === "true",
};

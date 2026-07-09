// Prisma 7 no longer auto-loads .env, so load it here for the CLI. The
// connection URL lives here (schema `datasource` blocks may no longer carry a
// `url` in v7); migrations use the installed driver adapter automatically.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

import "dotenv/config";
import { randomUUID } from "node:crypto";
import { Environment } from "vitest";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

//postgresql://docker:docker@localhost:5432/apisolid?schema=public

const prisma = new PrismaClient();

function generateDataBaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable");
  }

  console.log(process.env.DATABASE_URL)

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDataBaseURL(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
};

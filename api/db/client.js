// api/db/client.js
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Build the datasource URL from available env vars (works both in Docker and locally)
const dbHost =
	process.env.DATABASE_HOST ??
	process.env.MYSQL_HOST ??
	"localhost";
const dbPort = process.env.DATABASE_PORT ?? process.env.MYSQL_PORT ?? "3306";
const dbUser = process.env.DATABASE_USER ?? process.env.MYSQL_USER ?? "root";
const dbPass =
	process.env.DATABASE_PASSWORD ?? process.env.MYSQL_PASSWORD ?? "";
const dbName =
	process.env.DATABASE_NAME ??
	process.env.MYSQL_DBNAME ??
	process.env.MYSQL_DATABASE ??
	"mydb";

const connectionUrl =
	process.env.DATABASE_URL ??
	`mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

// Prisma 7+ client uses a driver adapter when no DATABASE_URL is present.
// Ensure DATABASE_URL for tools that still expect it, but pass an adapter to the client.
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = connectionUrl;
const adapter = new PrismaMariaDb(connectionUrl);

const prisma = globalThis.prisma ?? new PrismaClient({ adapter });

// Reuse client in dev to avoid exhausting connections during hot reloads
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;

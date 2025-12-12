// MySQL connection pool (mysql2/promise)
import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
	host:
		process.env.MYSQL_HOST ??
		process.env.DATABASE_HOST ??
		"localhost",
	user:
		process.env.MYSQL_USER ??
		process.env.DATABASE_USER ??
		"root",
	password:
		process.env.MYSQL_PASSWORD ??
		process.env.DATABASE_PASSWORD ??
		"",
	database:
		process.env.MYSQL_DBNAME ??
		process.env.MYSQL_DATABASE ??
		process.env.DATABASE_NAME ??
		"mydb",
	port: Number(
		process.env.MYSQL_PORT ??
			process.env.DATABASE_PORT ??
			3306
	),
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export default pool;

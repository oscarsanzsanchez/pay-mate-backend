import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "127.0.0.1",
	port: 4510,
	username: "root_pay_mate",
	password: "jMgWbiw1r2asi9vElbtnAenv6FL7jJ6g",
	database: "pay_mate",
	schema: "public",
	synchronize: true,
	entities: ["src/entities/**/*.ts"]
});

export const dbClient = AppDataSource;

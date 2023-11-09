import { server as hapiServer } from "@hapi/hapi";

import "dotenv/config";
import "reflect-metadata";
import { RegisterRoutes } from "routes";
import { AppDataSource } from "vendors/dbConnector";

const initServer = async () => {
	const server = hapiServer({
		port: 3000,
		host: "localhost"
	});
	RegisterRoutes(server);

	await server.start();

	try {
		await AppDataSource.initialize();

		console.log("✅ Database connected");
	} catch (err) {
		console.log("❌ Database connection failed - ", err);
	}

	console.log("🚀 Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

initServer();

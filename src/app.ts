import "reflect-metadata";
import express, { Express, json } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { IMongoService } from "./database/mongo.service.interface";
import { IConfigService } from "./config/config.service.interface";
import { ILogger } from "./logger/logger.service.interface";

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MongoService) private mongoService: IMongoService
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		await this.mongoService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`[App] Сервер запущен на http://localhost:${this.port}`);
	}
}

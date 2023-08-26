import { inject, injectable } from "inversify";
import { Mongoose } from "mongoose";
import { ConfigService } from "../config/config.service";
import { ILogger } from "../logger/logger.service.interface";
import { TYPES } from "../types";
import { IMongoService } from "./mongo.service.interface";

@injectable()
export class MongoService implements IMongoService {
	client: Mongoose;

	constructor(
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: ConfigService
	) {
		this.client = new Mongoose({
			strictQuery: false,
		});
	}
	private getMongoString() {
		return (
			`mongodb://` +
			this.configService.get("MONGO_LOGIN") +
			":" +
			this.configService.get("MONGO_PASSWORD") +
			"@" +
			this.configService.get("MONGO_HOST") +
			":" +
			this.configService.get("MONGO_PORT") +
			"/" +
			this.configService.get("MONGO_AUTHDATABASE")
		);
	}

	async connect() {
		const mongoURI = this.getMongoString();
		await this.client.connect(mongoURI);
		this.loggerService.log(`[MongoService] Успешно подключились к базе данных: ${mongoURI}`);
	}

	async disconnect() {
		await this.client.disconnect();
	}
}

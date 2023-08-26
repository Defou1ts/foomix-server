import { Mongoose } from "mongoose";

export interface IMongoService {
	client: Mongoose;

	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}

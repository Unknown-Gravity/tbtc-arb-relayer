import { Request, Response } from "express";
import CustomResponse from "../helpers/CustomResponse.helper";
import { getAllJsonOperations } from "../utils/JsonUtils";
import { LogError } from "../utils/Logs";

export default class Operations {
	getAllOperations = async (req: Request, res: Response) => {
		const response = new CustomResponse(res);

		try {
			const operations = await getAllJsonOperations();
			return response.ok("All ok", operations);
		} catch (err) {
			LogError("🚀 ~ getAllOperations ~ err:", err as Error);
			return response.ko((err as Error).message);
		}
	};
}

import { Request, Response } from "express";
import CustomResponse from "../helpers/CustomResponse.helper";
import { getAllJsonOperations } from "../utils/JsonUtils";
import { LogError } from "../utils/Logs";
import { Deposit } from "../types/Deposit.type";

/**
 * @name getAllOperations
 * @description Retrieves all operations from JSON storage and sends them in the response.
 * If an error occurs, logs the error and sends an error message in the response.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves to void.
 */

export default class Operations {
	getAllOperations = async (req: Request, res: Response): Promise<void> => {
		const response = new CustomResponse(res);
		try {
			const operations: Array<Deposit> = await getAllJsonOperations();
			response.ok("All ok", operations);
		} catch (err) {
			LogError("🚀 ~ getAllOperations ~ err:", err as Error);
			response.ko((err as Error).message);
		}
	};
}

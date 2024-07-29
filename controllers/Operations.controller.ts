import { Request, Response } from "express";
import CustomResponse from "../helpers/CustomResponse.helper";
import {
	getAllJsonOperations,
	getAllJsonOperationsFinalized,
	getAllJsonOperationsInitialized,
	getAllJsonOperationsQueued,
} from "../utils/JsonUtils";
import { LogError } from "../utils/Logs";
import { Deposit } from "../types/Deposit.type";

/**
 * @name Operations
 * @description Operations controller
 */
export default class Operations {
	/**
	 * @name getAllOperations
	 * @description Retrieves all operations from JSON storage and sends them in the response.
	 * If an error occurs, logs the error and sends an error message in the response.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 * @method GET
	 * @returns {Array<Deposit>} A promise that resolves to an array of deposits.
	 */
	getAllOperations = async (req: Request, res: Response): Promise<void> => {
		const response = new CustomResponse(res);
		try {
			const operations: Array<Deposit> = await getAllJsonOperations();
			response.ok("OK - Retrieved all operations", operations);
		} catch (err) {
			LogError("🚀 ~ getAllOperations ~ err:", err as Error);
			response.ko((err as Error).message);
		}
	};

	/**
	 * @name getAllQueuedOperations
	 * @description Retrieves all pending operations from JSON storage and sends them in the response.
	 * If an error occurs, logs the error and sends an error message in the response.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 * @method GET
	 * @returns {Array<Deposit>} A promise that resolves to an array of deposits.
	 */
	getAllQueuedOperations = async (req: Request, res: Response): Promise<void> => {
		const response = new CustomResponse(res);

		try {
			const operations: Array<Deposit> = await getAllJsonOperationsQueued();
			return response.ok("OK - Retrieved all queued operations", operations);
		} catch (err) {
			LogError("🚀 ~ getAllQueuedOperations ~ err:", err as Error);
			return response.ko((err as Error).message);
		}
	};

	/**
	 * @name getAllInitializedOperations
	 * @description Retrieves all initialized operations from JSON storage and sends them in the response.
	 * If an error occurs, logs the error and sends an error message in the response.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 * @method GET
	 * @returns {Promise<Array<Deposit>>} A promise that resolves to an array of deposits.
	 */
	getAllInitializedOperations = async (req: Request, res: Response): Promise<void> => {
		const response = new CustomResponse(res);

		try {
			const operations: Array<Deposit> = await getAllJsonOperationsInitialized();
			return response.ok("OK - Retrieved all initialized operations", operations);
		} catch (err) {
			LogError("🚀 ~ getAllInitializedOperations ~ err:", err as Error);
			return response.ko((err as Error).message);
		}
	};

	/**
	 * @name getAllFinalizedOperations
	 * @description Retrieves all finalized operations from JSON storage and sends them in the response.
	 * If an error occurs, logs the error and sends an error message in the response.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 * @method GET
	 * @returns {Promise<Array<Deposit>>} A promise that resolves to an array of deposits.
	 */
	getAllFinalizedOperations = async (req: Request, res: Response): Promise<void> => {
		const response = new CustomResponse(res);

		try {
			const operations: Array<Deposit> = await getAllJsonOperationsFinalized();
			return response.ok("OK - Retrieved all finalized operations", operations);
		} catch (err) {
			LogError("🚀 ~ getAllFinalizedOperations ~ err:", err as Error);
			return response.ko((err as Error).message);
		}
	};
}

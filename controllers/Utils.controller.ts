import { Response } from "express";
import CustomResponse from "../helpers/CustomResponse.helper";
import { LogError } from "../utils/Logs";
import { getAllJsonOperationsQueued } from "../utils/JsonUtils";
import { initializeDepositsL1 } from "../services/InitializeDepositServices/InitializeDepositsL1";

export default class Utils {
	/**
	 * @name defaultController
	 * @description Default controller
	 * @method GET
	 * @returns {Object} API information
	 */
	defaultController = (req: Request, res: Response): void => {
		const response = new CustomResponse(res);

		// Get API version
		const version = process.env.APP_VERSION || "1.0.0";

		// Get API name
		const name = process.env.APP_NAME || "Unknown API";

		// Send response
		response.ok("API Information: ", {
			name,
			version,
		});
	};

	/**
	 * @name pingController
	 * @description Check if API is running
	 * @method GET
	 * @returns {Object} API status
	 **/
	pingController = async (req: Request, res: Response): Promise<void> => {
		const response = new CustomResponse(res);

		try {
			response.ok();
		} catch (err) {
			LogError("🚀 ~ pingController ~ err:", err as Error);
			return response.ko((err as Error).message);
		}
	};

	test = async (req: Request, res: Response): Promise<void> => {
		// Your provided hex value
		const queuedDeposits = await getAllJsonOperationsQueued();
		initializeDepositsL1(queuedDeposits);
	};
}

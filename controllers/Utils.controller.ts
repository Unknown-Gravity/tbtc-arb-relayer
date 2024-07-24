import { Response } from "express";
import CustomResponse from "../helpers/CustomResponse.helper";
import { LogError } from "../utils/Logs";
import { initializeDepositsL1 } from "../services/InitializeDepositServices/InitializeDepositsL1";
import { getDepositId } from "../utils/GetDepositId";
import { getJsonById } from "../utils/JsonUtils";
import { Deposit } from "../types/Deposit.type";
import { Reveal } from "../types/Reveal.type";
import { getFundingTxHash } from "../utils/GetTransactionHash";

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
		const deposit: Deposit | null = getJsonById("6e96a81d2bad289ce301b0b8c3caaa5be89d668cb6e8d328e18a6b02d9d2f090");
		if (deposit != null) {
			const fundingTxHash = getFundingTxHash(deposit.L1OutputEvent.fundingTx);
			const depositID = getDepositId(fundingTxHash, deposit.L1OutputEvent.reveal[0]);
			console.log("🚀 ~ Utils ~ test= ~ depositID:", depositID);
		}
	};
}

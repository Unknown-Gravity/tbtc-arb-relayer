import { Response } from "express";
import CustomResponse from "../helpers/CustomResponse.helper";
import { LogError } from "../utils/Logs";
import { BitcoinTxHash } from "@keep-network/tbtc-v2.ts";
import { getJsonById } from "../utils/JsonUtils";
import { sdk } from "../services/initializeSDK";
import { L1BitcoinDepositor } from "../services/Core";
import { finalizeDeposit } from "../services/FinalizeDeposits";
import { attempFinalizeDeposit } from "../services/FinalizeDepositServices/AttempFinalizeDeposit";
import { BigNumber, ethers } from "ethers";
import { Deposit } from "../types/Deposit.type";

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
		const depositKey = {
			_hex: "0x5e2bba548443ddbd56d73609e3ab6fe58de7ef81e35dded1c80554fb8001a0f4",
			_isBigNumber: true,
		};

		// Convert using BigNumber
		const bignumber = BigNumber.from(depositKey._hex);

		// Convert to string to get the decimal representation
		const decimalString = ethers.utils.formatUnits(bignumber);
		console.log("🚀 ~ Utils ~ test= ~ decimalString:", decimalString);
	};
}

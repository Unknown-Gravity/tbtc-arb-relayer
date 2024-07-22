import { Response } from "express";
import CustomResponse from "../helpers/CustomResponse.helper";
import { LogError } from "../utils/Logs";
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
		const reveal = [
			0,
			"0x80d3273bc299b168",
			"0xef5a2946f294f1742a779c9ac034bc3fa5d417b8",
			"0xf39a4620c489d7a12726a7308e80230c2477f842",
			"0xf012fd67",
			"0xB5679dE944A79732A75CE556191DF11F489448d5",
			"0xB5679dE944A79732A75CE556191DF11F489448d5",
		];

		const l2DepositOwner = "0x91D9588F07d468A925d1103b89C18d4F1Ae1CF1F";

		const l2Sender = "0x91D9588F07d468A925d1103b89C18d4F1Ae1CF1F";

		const fundingTx = [
			"0x02000000",
			"0x01cfefe49a087d77defc6fc3deb7ca88956b61242dd5fd981a46e61c28052f82df0100000000fdffffff",
			"0x022c01000000000000220020b9cf19c4f8182a06e79c46b9036ca8a27dc873157727267e8e9efb027193da3e3c0f0000000000001600144309ce48a1f85ea0ba9e919a6699a7f6c4b12070",
			"0x81c62b00",
		];

		initializeDepositsL1();
	};
}

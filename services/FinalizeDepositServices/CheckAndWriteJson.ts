import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { LogMessage, LogError } from "../../utils/Logs";
import { sdk } from "../initializeSDK";
import { attempFinalizeDeposit } from "./AttempFinalizeDeposit";
import { checkFinalizeStatus } from "./CheckFinalizeStatus";

/**
 * @name checkAndWriteJson
 * @description Checks if the deposit status is "FINALIZED" and updates the JSON storage accordingly. If not, attempts to finalize the deposit.
 * @param {Deposit} deposit - The deposit object to be checked and potentially finalized.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */
export const checkAndWriteJson = async (deposit: Deposit): Promise<void> => {
	try {
		const status = await checkFinalizeStatus(deposit.id);
		if (status) {
			const updatedDeposit: Deposit = {
				...deposit,
				status: "FINALIZED",
				dates: { ...deposit.dates, finalizationAt: Date.now() },
			};

			await writeJson(updatedDeposit, deposit.id);
			LogMessage(`Deposit has been finalized | ID: ${deposit.id}`);
		} else {
			await attempFinalizeDeposit(deposit);
		}
	} catch (error) {
		LogError("Error in checkAndWriteJson", error as Error);
	}
};

import { Deposit } from "../../types/Deposit.type";
import { LogError } from "../../utils/Logs";
import { L1BitcoinDepositor } from "../Core";

/**
 * @name checkTxStatus
 * @description Check the status of a transaction
 * @param {Deposit} deposit - The deposit we want to check the status
 * @returns {Promise<number>} A promise that resolves when the deposit status is updated in the JSON storage.
 */
export const checkTxStatus = async (deposit: Deposit): Promise<number> => {
	try {
		const currentStatus = await L1BitcoinDepositor.deposits(deposit.id);
		console.log("🚀 ~ checkTxStatus ~ currentStatus:", currentStatus);
		return currentStatus;
	} catch (error) {
		LogError("Error fetching status", error as Error);
		return 0;
	}
};

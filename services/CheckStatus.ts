import { Deposit } from "../types/Deposit.type";
import { LogError } from "../utils/Logs";
import { L1BitcoinDepositor, TIME_TO_RETRY } from "./Core";

/**
 * @name checkTxStatus
 * @description Check the status of a transaction
 * @param {Deposit} deposit - The deposit we want to check the status
 * @returns {Promise<number>} A promise that resolves when the deposit status is updated in the JSON storage.
 */
export const checkTxStatus = async (deposit: Deposit): Promise<number> => {
	try {
		return await L1BitcoinDepositor.deposits(deposit.id);
	} catch (error) {
		LogError("Error fetching status", error as Error);
		return 0;
	}
};

export const filterDepositsActivityTime = (deposits: Array<Deposit>): Array<Deposit> => {
	return deposits.filter((deposit: Deposit) => {
		return deposit.dates.lastActivityAt === null || deposit.dates.lastActivityAt + TIME_TO_RETRY > Date.now();
	});
};

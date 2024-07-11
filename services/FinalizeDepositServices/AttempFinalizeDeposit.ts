import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { LogMessage } from "../../utils/Logs";
import { L1BitcoinDepositor } from "../Core";

/**
 * @name attemptFinalizeDeposit
 * @description Attempts to finalize a deposit. If successful, updates the status of the deposit in the JSON storage.
 * @param {Deposit} deposit - The deposit object to be finalized.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const attempFinalizeDeposit = async (deposit: Deposit): Promise<void> => {
	try {
		LogMessage(`Trying to finalized deposit with id: ${deposit.id}`);
		await L1BitcoinDepositor.callStatic.finalizeDeposit(deposit.id);
		const dep = L1BitcoinDepositor.finalizeDeposit(deposit.id);
		dep.wait();
		writeJson({ ...deposit, status: "FINALIZED" }, deposit.id);
		LogMessage(`Deposit has been finalized | Id: ${deposit.id}`);
	} catch (error) {
		console.log("Desposit cant' be finalized", error);
	}
};

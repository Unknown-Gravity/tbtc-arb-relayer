import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { LogError, LogMessage } from "../../utils/Logs";
import { L1BitcoinDepositor } from "../Core";

/**
 * @name attemptFinalizeDeposit
 * @description Attempts to finalize a deposit. If successful, updates the status of the deposit in the JSON storage.
 * @param {Deposit} deposit - The deposit object to be finalized.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const attempFinalizeDeposit = async (deposit: Deposit): Promise<void> => {
	try {
		const value = (await L1BitcoinDepositor.quoteFinalizeDeposit()).toString();
		console.log("🚀 ~ attempFinalizeDeposit ~ value:", value.toString());
		LogMessage(`Trying to finalized deposit with id: ${deposit.id}`);
		await L1BitcoinDepositor.callStatic.finalizeDeposit(deposit.id, { value: value });
		const dep = await L1BitcoinDepositor.finalizeDeposit(deposit.id, { value: value });
		await dep.wait();
		writeJson(
			{
				...deposit,
				status: "FINALIZED",
				dates: { ...deposit.dates, finalizationAt: new Date().getTime() },
				hashes: { ...deposit.hashes, eth: { ...deposit.hashes.eth, finalizeTxHash: dep.hash } },
			},
			deposit.id
		);
		LogMessage(`Deposit has been finalized | Id: ${deposit.id}`);
	} catch (error) {
		LogError("Desposit cant' be finalized", error as Error);
	}
};

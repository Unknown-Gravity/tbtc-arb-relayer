import { Deposit } from "../../types/Deposit.type";
import { getAllJsonOperationsQueued, writeJson } from "../../utils/JsonUtils";
import { LogError, LogWarning } from "../../utils/Logs";
import { checkTxStatus } from "./CheckTxStatus";
import { getTransactionConfirmations } from "./GetTransactionConfirmations";
import { initializeDepositL1 } from "./InitializeDepositL1";

/**
 * @name initializeDepositsL1
 * @description Initialize all the deposits that we have in the storage
 * @param {Array<Deposit>} queuedDeposits - The list of deposits we want to initilize
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const initializeDepositsL1 = async (queuedDeposits: Array<Deposit>): Promise<void> => {
	try {
		const promises: Promise<void>[] = queuedDeposits.map(async (deposit: Deposit) => {
			// const confirmations: number = await getTransactionConfirmations(deposit.txHash);
			// console.log("🚀 ~ initializeDeposit ~ confirmations:", confirmations);
			// if (confirmations > 1) {
			const status = await checkTxStatus(deposit);
			console.log("🚀 ~ constpromises:Promise<void>[]=queued.map ~ status:", status);
			if (status === 1) {
				await writeJson(
					{
						...deposit,
						status: "INITIALIZED",
						dates: { ...deposit.dates, initializationAt: new Date().getTime() },
					},
					deposit.id
				);
			} else if (status === 0) {
				initializeDepositL1(deposit);
			}
			// }
		});
		await Promise.all(promises);
	} catch (error) {
		LogError("Error in initializeDeposit:", error as Error);
	}
};

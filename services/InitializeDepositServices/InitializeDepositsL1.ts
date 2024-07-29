import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { LogError } from "../../utils/Logs";
import { checkTxStatus } from "./CheckTxStatus";
import { initializeDepositL1 } from "./InitializeDepositL1";

/**
 * @name initializeDepositsL1
 * @description Initialize all the deposits that we have in the storage
 * @param {Array<Deposit>} queuedDeposits - The list of deposits we want to initialize
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */
export const initializeDepositsL1 = async (queuedDeposits: Array<Deposit>): Promise<void> => {
	try {
		const promises: Promise<void>[] = queuedDeposits.map(async (deposit: Deposit) => {
			const status = await checkTxStatus(deposit);
			console.log("🚀 ~ initializeDepositsL1 ~ status:", status);
			if (status === 1) {
				const updatedDeposit: Deposit = {
					...deposit,
					status: "INITIALIZED",
					dates: { ...deposit.dates, initializationAt: Date.now() },
				};
				await writeJson(updatedDeposit, deposit.id);
			} else if (status === 0) {
				await initializeDepositL1(deposit);
			}
		});
		await Promise.all(promises);
	} catch (error) {
		LogError("Error in initializeDepositsL1:", error as Error);
	}
};

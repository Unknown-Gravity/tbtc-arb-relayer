import { Deposit } from "../../types/Deposit.type";
import { getAllJsonOperationsQueued } from "../../utils/JsonUtils";
import { LogError, LogWarning } from "../../utils/Logs";
import { checkTxStatus } from "./CheckTxStatus";
import { getTransactionConfirmations } from "./GetTransactionConfirmations";
import { initializeDepositL1 } from "./InitializeDepositL1";

export const initializeDepositsL1 = async () => {
	try {
		const queued: Deposit[] = await getAllJsonOperationsQueued();
		if (queued.length > 0) {
			const promises: Promise<void>[] = queued.map(async (deposit: Deposit) => {
				// const confirmations: number = await getTransactionConfirmations(deposit.txHash);
				// console.log("🚀 ~ initializeDeposit ~ confirmations:", confirmations);
				// if (confirmations > 1) {
				const status = await checkTxStatus(deposit);
				console.log("🚀 ~ constpromises:Promise<void>[]=queued.map ~ status:", status);
				if (status) {
					initializeDepositL1(deposit);
				}
				// }
			});
			await Promise.all(promises);
		} else {
			LogWarning("No queued deposits found");
		}
	} catch (error) {
		LogError("Error in initializeDeposit:", error as Error);
	}
};

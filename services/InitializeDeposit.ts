/*
This will initialise the QUEUED deposits in the L1BitcoinDepositor contract.

This task should:
- Fetch all QUEUED deposits from the persistent storage.
- Choose deposits whose funding BTC transaction has at least 1 confirmation (abuse protection).
- For each deposit that fulfills the above condition, check its state in the L1BitcoinDepositor contract (using the L1BitcoinDepositor.deposits call)
- If the given deposit is unknown, call L1BitcoinDepositor.initializeDeposit and update the internal deposit’s state to INITIALIZED
- If the given deposit is already initialized, don’t call the contract and just update the internal deposit’s state to INITIALIZED (corner case when deposit was initialized outside the relayer).
- If the given deposit is already finalized, don’t call the contract and just update the internal deposit’s state to FINALIZED (corner case when deposit was initialized and finalized outside the relayer).

More info: https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
*/

import { Deposit } from "../types/Deposit.type";
import { DepositQueuedData } from "../types/DepositQueuedData";
import { FundingTx } from "../types/FundingTx.type";
import { L2Sender } from "../types/L2Sender.type";
import { getAllJsonOperationsQueued } from "../utils/JsonUtils";
import { LogError, LogWarning } from "../utils/Logs";
import { checkTransactionStatus } from "./InitializeDepositServices/CheckTransactionStatus";
import { getTransactionConfirmations } from "./InitializeDepositServices/GetTransactionConfirmations";

/**
 * @name initializeDeposit
 * @description Initialize the queued deposits
 * @returns {Promise<void>} A promise that resolves when all deposits have been checked and their statuses have been updated.
 */

export const initializeDeposit = async (
	fundingTx: FundingTx,
	reveal: string,
	l2DepositOwner: string,
	l2Sender: L2Sender
): Promise<void> => {
	try {
		const depositData: DepositQueuedData = {
			fundingTx: fundingTx,
			reveal: reveal,
			l2DepositOwner: l2DepositOwner,
			l2Sender: l2Sender,
		};
		const queued: Deposit[] = await getAllJsonOperationsQueued();

		if (queued.length > 0) {
			const promises: Promise<void>[] = queued.map(async (operation: Deposit) => {
				const confirmations: number = await getTransactionConfirmations(operation.txHash);
				console.log("🚀 ~ initializeDeposit ~ confirmations:", confirmations);
				if (confirmations > 1) {
					await checkTransactionStatus(operation, depositData);
				}
			});
			await Promise.all(promises);
		} else {
			LogWarning("No queued operations found");
		}
	} catch (error) {
		LogError("Error in initializeDeposit:", error as Error);
	}
};

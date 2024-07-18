import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { L1BitcoinDepositor } from "../Core";
import { DepositQueuedData } from "../../types/DepositQueuedData";
import { LogError } from "../../utils/Logs";

/**
 * @name checkTransactionStatus
 * @description Checks the transaction status and updates the JSON storage accordingly.
 * Updates the status of the deposit based on the transaction status.
 * @param {Deposit} deposit - The deposit object to check and update.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const checkTransactionStatus = async (deposit: Deposit, depositData: DepositQueuedData): Promise<void> => {
	const currentStatus = await L1BitcoinDepositor.deposits(deposit.id);
	console.log("🚀 ~ checkTransactionStatus ~ currentStatus:", currentStatus);

	try {
		if (currentStatus === 1) {
			writeJson(
				{
					...deposit,
					status: "INITIALIZED",
					dates: { ...deposit.dates, initializationAt: new Date().getTime() },
				},
				deposit.id
			);
		} else if (currentStatus === 2) {
			writeJson(
				{
					...deposit,
					status: "INITIALIZED",
					dates: { ...deposit.dates, initializationAt: new Date().getTime() },
				},
				deposit.id
			);
		} else if (currentStatus === 0) {
			const fundingTx: any = {
				version: depositData.fundingTx[0],
				inputVector: depositData.fundingTx[1],
				outputVector: depositData.fundingTx[2],
				locktime: depositData.fundingTx[3],
			};
			const reveal: any = {
				fundingOutputIndex: depositData.reveal[0],
				blindingFactor: depositData.reveal[1],
				walletPubKeyHash: depositData.reveal[2],
				refundPubKeyHash: depositData.reveal[3],
				refundLocktime: depositData.reveal[4],
				vault: depositData.reveal[5],
			};
			const tx = await L1BitcoinDepositor.initializeDeposit(fundingTx, reveal, depositData.l2DepositOwner);
			console.log("🚀 ~ checkTransactionStatus ~ tx:", tx);
			writeJson(
				{
					...deposit,
					status: "INITIALIZED",
					dates: { ...deposit.dates, initializationAt: new Date().getTime() },
				},
				deposit.txHash
			);
		}
	} catch (error) {
		LogError(`Error initializing deposit for txHash ${deposit.txHash}:`, error as Error);
	}
};

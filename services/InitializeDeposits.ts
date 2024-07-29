import { Deposit } from "../types/Deposit.type";
import { DepositStatus } from "../types/DepositStatus.enum";
import { updateInitializedDeposit } from "../utils/Deposits";
import { getAllJsonOperationsQueued, writeJson } from "../utils/JsonUtils";
import { LogError } from "../utils/Logs";
import { checkTxStatus } from "./CheckStatus";
import { L1BitcoinDepositor } from "./Core";

// ----------------------------------------------------------
// |                     MAIN FUNCTIONS                     |
// ----------------------------------------------------------

/**
 * @name initializeDeposits
 * @description Initialize all the deposits that we have in the storage
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */
export const initializeDeposits = async () => {
	try {
		const queuedDeposits: Array<Deposit> = await getAllJsonOperationsQueued();
		if (queuedDeposits.length === 0) return;

		const promises: Promise<void>[] = queuedDeposits.map(async (deposit: Deposit) => {
			const status = await checkTxStatus(deposit);

			if (status === DepositStatus.INITIALIZED) {
				updateInitializedDeposit(deposit);
			} else if (status === DepositStatus.QUEUED) {
				await attempInitializeDeposit(deposit);
			}
		});
		await Promise.all(promises);
	} catch (error) {
		LogError("Error in initializeDeposits:", error as Error);
	}
};

// ----------------------------------------------------------
// |                    AUXILIARY FUNCTIONS                 |
// ----------------------------------------------------------

/**
 * @name attempInitializeDeposit
 * @description Initialize one deposit
 * @param {Deposit} deposit - The deposit object to check and update.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const attempInitializeDeposit = async (deposit: Deposit): Promise<void> => {
	try {
		// Pre-call
		await L1BitcoinDepositor.callStatic.initializeDeposit(
			deposit.L1OutputEvent.fundingTx,
			deposit.L1OutputEvent.reveal,
			deposit.L1OutputEvent.l2DepositOwner
		);

		// Call
		const tx = await L1BitcoinDepositor.initializeDeposit(
			deposit.L1OutputEvent.fundingTx,
			deposit.L1OutputEvent.reveal,
			deposit.L1OutputEvent.l2DepositOwner
		);

		// Wait for the transaction to be mined
		await tx.wait();

		// Update the deposit status in the JSON storage
		updateInitializedDeposit(deposit, tx);
	} catch (error) {
		LogError(`Error initializing deposit for txHash ${deposit.hashes.btc.btcTxHash}:`, error as Error);
	}
};

import { Deposit } from "../types/Deposit.type";
import { DepositStatus } from "../types/DepositStatus.enum";
import { updateFinalizedDeposit } from "../utils/Deposits";
import { getAllJsonOperationsInitialized, writeJson } from "../utils/JsonUtils";
import { LogError, LogMessage } from "../utils/Logs";
import { checkTxStatus } from "./CheckStatus";
import { L1BitcoinDepositor } from "./Core";

/*****************************************************************************************
That will finalize INITIALIZED deposits in the L1BitcoinDepositor contract.

This task should:
- Fetch all INITIALIZED deposits from the persistent storage.
- For each deposit, check if it is already finalized in the L1BitcoinDepositor contract (using the L1BitcoinDepositor.deposits call):
- If not finalized, check finalization possibility (by executing a pre-flight call to L1BitcoinDepositor.finalizeDeposit)
- If finalization is possible, call L1BitcoinDepositor.finalizeDeposit and update the internal deposit’s state to FINALIZED.
- If finalization is not possible, do nothing.
- If already finalized, don’t call the contract and just update the internal deposit’s state to FINALIZED (corner case when deposit was finalized outside the relayer).

More info:
https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
*****************************************************************************************/

// ----------------------------------------------------------
// |                     MAIN FUNCTIONS                     |
// ----------------------------------------------------------

/**
 * @name finalizeDeposit
 * @description Retrieves all deposits that are in the initialized state and attempts to update their status to "FINALIZED" by checking and updating the JSON storage.
 * @returns {Promise<void>} A promise that resolves when all deposits have been checked and their statuses have been updated.
 */

export const finalizeDeposit = async (): Promise<void> => {
	try {
		const initializedDeposits: Array<Deposit> = await getAllJsonOperationsInitialized();
		if (initializedDeposits.length === 0) return;

		const promises: Promise<void>[] = initializedDeposits.map(async (deposit: Deposit) => {
			const status = await checkTxStatus(deposit);

			if (status === DepositStatus.FINALIZED) {
				updateFinalizedDeposit(deposit);
			} else if (DepositStatus.INITIALIZED) {
				await attempFinalizeDeposit(deposit);
			}
		});
		await Promise.all(promises);
	} catch (error) {
		LogError("Error finalizing deposits", error as Error);
	}
};

// ----------------------------------------------------------
// |                    AUXILIARY FUNCTIONS                 |
// ----------------------------------------------------------

/**
 * @name attemptFinalizeDeposit
 * @description Attempts to finalize a deposit. If successful, updates the status of the deposit in the JSON storage.
 * @param {Deposit} deposit - The deposit object to be finalized.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const attempFinalizeDeposit = async (deposit: Deposit): Promise<void> => {
	try {
		const value = (await L1BitcoinDepositor.quoteFinalizeDeposit()).toString();
		LogMessage(`Trying to finalized deposit with id: ${deposit.id} | Value: ${value}`);

		// Pre-call
		await L1BitcoinDepositor.callStatic.finalizeDeposit(deposit.id, { value: value });

		// Call
		const tx = await L1BitcoinDepositor.finalizeDeposit(deposit.id, { value: value });

		// Wait for the transaction to be mined
		await tx.wait();

		// Update the deposit status in the JSON storage
		updateFinalizedDeposit(deposit, tx);
	} catch (error) {
		LogError("Desposit cant' be finalized", error as Error);
	}
};

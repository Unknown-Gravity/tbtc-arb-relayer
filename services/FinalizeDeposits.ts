import { Deposit } from "../types/Deposit.type";
import { DepositStatus } from "../types/DepositStatus.enum";
import { updateFinalizedDeposit, updateLastActivity } from "../utils/Deposits";
import { getAllJsonOperationsByStatus } from "../utils/JsonUtils";
import { LogError, LogMessage } from "../utils/Logs";
import { checkTxStatus, filterDepositsActivityTime } from "./CheckStatus";
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
 * @name finalizeDeposits
 * @description Retrieves all deposits that are in the initialized state and attempts to update their status to "FINALIZED" by checking and updating the JSON storage.
 * @returns {Promise<void>} A promise that resolves when all deposits have been checked and their statuses have been updated.
 */

export const finalizeDeposits = async (): Promise<void> => {
	try {
		const initializedDeposits: Array<Deposit> = await getAllJsonOperationsByStatus("INITIALIZED");
		if (initializedDeposits.length === 0) return;

		// Filter deposits that have more than 5 minutes since the last activity
		// This is to avoid calling the contract for deposits that have been recently
		// checked and are still in the same state
		const filterDeposits = filterDepositsActivityTime(initializedDeposits);
		if (filterDeposits.length === 0) return;

		LogMessage(`FINALIZE | To be processed: ${filterDeposits.length} deposits`);

		const promises: Promise<void>[] = filterDeposits.map(async (deposit: Deposit) => {
			// Update the last activity timestamp of the deposit
			deposit = updateLastActivity(deposit);
			// Check the status of the deposit in the contract
			const status = await checkTxStatus(deposit);

			if (status === DepositStatus.FINALIZED) {
				updateFinalizedDeposit(deposit, "Deposit already finalized");
			} else if (status === DepositStatus.INITIALIZED) {
				await attempFinalizeDeposit(deposit);
			}
		});

		// Wait for all the promises to resolve
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

		// Pre-call
		LogMessage(`FINALIZE | Pre-call checking... | ID: ${deposit.id} | Value: ${value}`);
		await L1BitcoinDepositor.callStatic.finalizeDeposit(deposit.id, { value: value });
		LogMessage(`FINALIZE | Pre-call successful | ID: ${deposit.id}`);

		// Call
		const tx = await L1BitcoinDepositor.finalizeDeposit(deposit.id, { value: value });

		LogMessage(`FINALIZE | Waiting to be mined | ID: ${deposit.id} | TxHash: ${tx.hash}`);
		// Wait for the transaction to be mined
		await tx.wait();
		LogMessage(`FINALIZE | Transaction mined | ID: ${deposit.id} | TxHash: ${tx.hash}`);

		// Update the deposit status in the JSON storage
		updateFinalizedDeposit(deposit, tx);
	} catch (error: any) {
		const reason = error.reason ? error.reason : "Unknown error";
		LogError(`Error finalizing deposit | ID: ${deposit.id} | Reason: `, reason);
		updateFinalizedDeposit(deposit, null, reason);
	}
};

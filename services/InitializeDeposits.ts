import { Deposit } from "../types/Deposit.type";
import { DepositStatus } from "../types/DepositStatus.enum";
import { updateInitializedDeposit } from "../utils/Deposits";
import { getAllJsonOperationsQueued, writeJson } from "../utils/JsonUtils";
import { LogError } from "../utils/Logs";
import { checkTxStatus, filterDepositsActivityTime } from "./CheckStatus";
import { L1BitcoinDepositor } from "./Core";

/*****************************************************************************************
This will initialise the QUEUED deposits in the L1BitcoinDepositor contract.

This task should:
- Fetch all QUEUED deposits from the persistent storage.
- Choose deposits whose funding BTC transaction has at least 1 confirmation (abuse protection).
- For each deposit that fulfills the above condition, check its state in the L1BitcoinDepositor contract (using the L1BitcoinDepositor.deposits call)
- If the given deposit is unknown, call L1BitcoinDepositor.initializeDeposit and update the internal deposit’s state to INITIALIZED
- If the given deposit is already initialized, don’t call the contract and just update the internal deposit’s state to INITIALIZED (corner case when deposit was initialized outside the relayer).
- If the given deposit is already finalized, don’t call the contract and just update the internal deposit’s state to FINALIZED (corner case when deposit was initialized and finalized outside the relayer).

More info:
https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
*****************************************************************************************/

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

		// Filter deposits that have more than 5 minutes since the last activity
		// This is to avoid calling the contract for deposits that have been recently
		// checked and are still in the same state

		const filterDeposits = filterDepositsActivityTime(queuedDeposits);
		if (filterDeposits.length === 0) return;

		const promises: Promise<void>[] = filterDeposits.map(async (deposit: Deposit) => {
			const status = await checkTxStatus(deposit);

			if (status === DepositStatus.INITIALIZED) {
				updateInitializedDeposit(deposit);
			} else if (status === DepositStatus.QUEUED) {
				await attempInitializeDeposit(deposit);
			}
		});

		// Wait for all the promises to resolve
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

/*
The goal of this task is cleaning up trash deposits and preventing relayer’s congestion.

This task should:
- Delete (remove from persistent storage) QUEUED deposits that have been in that state for more than 48 hours.
- Delete (remove from persistent storage) any deposits that are in the FINALIZED state for more than 12 hours.

More info: https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
*/

import { Deposit } from "../types/Deposit.type";
import { getAllJsonOperationsFinalized, getAllJsonOperationsQueued } from "../utils/JsonUtils";
import { LogMessage } from "../utils/Logs";

/**
 * Clean up the deposits that have been in the QUEUED state for more than 48 hours.
 */

// Current timestamp - 48 hours = 48 * 60 * 60 * 1000
const QUEUED_TIME: number = parseInt(process.env.CLEAN_QUEUED_TIME || "48", 10);
const olderThan48Hours: number = QUEUED_TIME * 60 * 60 * 1000;

export const cleanQueuedDeposits = async (): Promise<void> => {
	const operations: Deposit[] = await getAllJsonOperationsQueued();

	// Get the current timestamp
	const currentTime: EpochTimeStamp = new Date().getTime();

	// Filter the deposits that have been in the QUEUED state for more than 48 hours
	const depositsToDelete: Deposit[] = operations.filter((operation) => {
		const operationTimestamp: EpochTimeStamp = new Date(operation.dates.queuedAt).getTime();
		return currentTime - operationTimestamp > olderThan48Hours;
	});

	// Delete the deposits
	depositsToDelete.forEach((deposit) => {
		LogMessage(
			`Deleting QUEUED deposit with ID ${deposit.id} | Actual: ${currentTime} | Creation: ${
				deposit.dates.createdAt
			} | Difference: ${currentTime - deposit.dates.createdAt}`
		);
		// deleteJson(deposit.id);
	});
};

/**
 * Clean up the deposits that have been in the FINALIZED state for more than 12 hours.
 */

const FINALIZED_TIME: number = parseInt(process.env.CLEAN_FINALIZED_TIME || "12", 10);
const olderThan12Hours: number = FINALIZED_TIME * 60 * 60 * 1000;

export const cleanFinalizedDeposits = async () => {
	const operations: Deposit[] = await getAllJsonOperationsFinalized();

	// Get the current timestamp
	const currentTime: EpochTimeStamp = new Date().getTime();

	// Filter the deposits that have been in the FINALIZED state for more than 12 hours
	const depositsToDelete: Deposit[] = operations.filter((operation) => {
		const operationTimestamp: EpochTimeStamp = new Date(operation.dates.finalizationAt).getTime();
		return currentTime - operationTimestamp > olderThan12Hours;
	});

	// Delete the deposits
	depositsToDelete.forEach((deposit) => {
		LogMessage(
			`Deleting FINALIZED deposit with ID ${deposit.id} | Actual: ${currentTime} | Creation: ${
				deposit.dates.createdAt
			} | Difference: ${currentTime - deposit.dates.createdAt}`
		);
		// deleteJson(deposit.id);
	});
};

import { Deposit } from "../types/Deposit.type";
import { deleteJson, getAllJsonOperationsFinalized, getAllJsonOperationsQueued } from "../utils/JsonUtils";
import { LogMessage } from "../utils/Logs";

/**
 * @name cleanQueuedDeposits
 * @description Cleans up the deposits that have been in the QUEUED state for more than 48 hours.
 * @returns {Promise<void>} A promise that resolves when the old queued deposits are deleted.
 */

const REMOVE_QUEUED_TIME: number = parseInt(process.env.CLEAN_QUEUED_TIME || "48", 10) * 60 * 60 * 1000;

export const cleanQueuedDeposits = async (): Promise<void> => {
	const operations: Deposit[] = await getAllJsonOperationsQueued();
	if (operations.length === 0) return;

	// Get the current timestamp
	const currentTime: EpochTimeStamp = Date.now();

	// Filter the deposits that have been in the QUEUED state for more than 48 hours
	const depositsToDelete: Deposit[] = operations.filter((operation) => {
		const createdAt: number | null = operation.dates.createdAt
			? new Date(operation.dates.createdAt).getTime()
			: null;
		return createdAt !== null && currentTime - createdAt > REMOVE_QUEUED_TIME;
	});

	// Delete the deposits
	depositsToDelete.forEach((deposit) => {
		LogMessage(
			`Deleting QUEUED deposit with ID ${deposit.id} | Actual: ${currentTime} | Creation: ${
				deposit.dates.createdAt
			} | Difference: ${
				currentTime - (deposit.dates.createdAt ? new Date(deposit.dates.createdAt).getTime() : 0)
			}`
		);
		deleteJson(deposit.id);
	});
};

/**
 * @name cleanFinalizedDeposits
 * @description Cleans up the deposits that have been in the FINALIZED state for more than 12 hours.
 * @returns {Promise<void>} A promise that resolves when the old finalized deposits are deleted.
 */

const REMOVE_FINALIZED_TIME: number = parseInt(process.env.CLEAN_FINALIZED_TIME || "12", 10) * 60 * 60 * 1000;

export const cleanFinalizedDeposits = async () => {
	const operations: Deposit[] = await getAllJsonOperationsFinalized();

	if (operations.length > 0) {
		// Get the current timestamp
		const currentTime: EpochTimeStamp = new Date().getTime();

		// Filter the deposits that have been in the FINALIZED state for more than 12 hours
		const depositsToDelete: Deposit[] = operations.filter((operation) => {
			const finalizationAt: number | null = operation.dates.finalizationAt
				? new Date(operation.dates.finalizationAt).getTime()
				: null;
			return finalizationAt !== null && currentTime - finalizationAt > REMOVE_FINALIZED_TIME;
		});

		// Delete the deposits
		depositsToDelete.forEach((deposit) => {
			LogMessage(
				`Deleting FINALIZED deposit with ID ${deposit.id} | Actual: ${currentTime} | Creation: ${
					deposit.dates.createdAt
				} | Difference: ${
					currentTime - (deposit.dates.createdAt ? new Date(deposit.dates.createdAt).getTime() : 0)
				}`
			);
			deleteJson(deposit.id);
		});
	}
};

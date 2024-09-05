import { Deposit } from "../types/Deposit.type";
import { deleteJson, getAllJsonOperationsByStatus } from "../utils/JsonUtils";
import { LogMessage } from "../utils/Logs";

/****************************************************************************************
The goal of this task is cleaning up trash deposits and preventing relayer’s congestion.

This task should:
- Delete (remove from persistent storage) QUEUED deposits that have been in that state for more than 48 hours.
- Delete (remove from persistent storage) any deposits that are in the FINALIZED state for more than 12 hours.

More info:
https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
****************************************************************************************/

/**
 * @name cleanQueuedDeposits
 * @description Cleans up the deposits that have been in the QUEUED state for more than 48 hours.
 * @returns {Promise<void>} A promise that resolves when the old queued deposits are deleted.
 */

const REMOVE_QUEUED_TIME_MS: number = parseInt(process.env.CLEAN_QUEUED_TIME || "48", 10) * 60 * 60 * 1000;

export const cleanQueuedDeposits = async (): Promise<void> => {
	const operations: Deposit[] = await getAllJsonOperationsByStatus("QUEUED");
	const currentTime = Date.now();

	// Filtrar y eliminar depósitos en una sola pasada, verificando que createdAt exista
	operations.forEach(({ id, dates }) => {
		const createdAt = dates?.createdAt ? new Date(dates.createdAt).getTime() : null;
		if (!createdAt) return;

		const ageInMs = currentTime - createdAt;

		// Verifica si createdAt es válido antes de proceder
		if (ageInMs > REMOVE_QUEUED_TIME_MS) {
			const ageInHours = (ageInMs / (60 * 60 * 1000)).toFixed(2);

			LogMessage(`Deleting QUEUED ID: ${id} | Created: ${dates.createdAt} | Age: ${ageInHours} hours`);
			deleteJson(id);
		}
	});
};

/**
 * @name cleanFinalizedDeposits
 * @description Cleans up the deposits that have been in the FINALIZED state for more than 12 hours.
 * @returns {Promise<void>} A promise that resolves when the old finalized deposits are deleted.
 */

const REMOVE_FINALIZED_TIME_MS: number = parseInt(process.env.CLEAN_FINALIZED_TIME || "12", 10) * 60 * 60 * 1000;

export const cleanFinalizedDeposits = async (): Promise<void> => {
	const operations: Deposit[] = await getAllJsonOperationsByStatus("FINALIZED");
	const currentTime = Date.now();

	// Filter and delete deposits in a single pass, checking that finalizationAt exists
	operations.forEach(({ id, dates }) => {
		const finalizationAt = dates?.finalizationAt ? new Date(dates.finalizationAt).getTime() : null;
		if (!finalizationAt) return;

		const ageInMs = currentTime - finalizationAt;

		if (ageInMs > REMOVE_FINALIZED_TIME_MS) {
			const ageInHours = (ageInMs / (60 * 60 * 1000)).toFixed(2);

			LogMessage(`Deleting FINALIZED ID: ${id} | Finalized: ${dates.finalizationAt} | Age: ${ageInHours} hours`);
			deleteJson(id);
		}
	});
};

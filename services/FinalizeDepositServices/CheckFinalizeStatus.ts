import { L1BitcoinDepositor } from "../Core";

/**
 * @name checkFinalizeStatus
 * @description Checks if the deposit status is "FINALIZED".
 * @param {String} operationId - The id of the deposit
 * @returns {Promise<boolean>} True if operation is "FINALIZED"
 */

export const checkFinalizeStatus = async (operationId: string): Promise<boolean> => {
	const status: number = await L1BitcoinDepositor.deposits(operationId);
	return status === 2;
};

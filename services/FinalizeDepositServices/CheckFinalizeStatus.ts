import { TestContract } from "../Core";

/**
 * @name checkFinalizeStatus
 * @description Checks if the deposit status is "FINALIZED".
 * @param {String} operationId - The id of the deposit
 * @returns {Promise<boolean>} True if operation is "FINALIZED"
 */

export const checkFinalizeStatus = async (operationId: string): Promise<boolean> => {
	const status: number = await TestContract.deposits(operationId);
	return status === 2;
};

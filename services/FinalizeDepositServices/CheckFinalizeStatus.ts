import { TestContract } from "../Core";

export const checkFinalizeStatus = async (operationId: string): Promise<boolean> => {
	const status: number = await TestContract.deposits(operationId);
	return status === 2;
};

import axios, { AxiosResponse } from "axios";

/**
 * @name getTransactionConfirmations
 * @description Get the confirmations of a transaction
 * @param {String} txHash - the hash code of the transaction to check
 * @returns {Promise<number>} A Promise of the number of confirmations
 */

export const getTransactionConfirmations = async (txHash: string): Promise<number> => {
	try {
		const apiURL: string = process.env.TESTNET_BTC_API_URL || "";
		const response: AxiosResponse = await axios.get(`${apiURL}${txHash}`);
		return response.data.confirmations;
	} catch (error) {
		console.error(`Error fetching confirmations for txid ${txHash}:`, error);
		throw error;
	}
};

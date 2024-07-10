import axios, { AxiosResponse } from "axios";

const apiURL: string = process.env.ALTER_API_URL || "";

export const getTransactionConfirmations = async (txHash: string): Promise<number> => {
	try {
		const response: AxiosResponse = await axios.get(`${apiURL}${txHash}`);
		return response.data.confirmations;
	} catch (error) {
		console.error(`Error fetching confirmations for txid ${txHash}:`, error);
		throw error;
	}
};

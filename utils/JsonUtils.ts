import { Deposit } from "../types/Deposit.type";
import { FundingTransaction } from "../types/FundingTransaction.type";
import { createDeposit } from "./Deposits";
import { LogError } from "./Logs";

const fs = require("fs");
const path = require("path");
// const { LogError } = require("./Logs.js");

// ---------------------------------------------------------------
// ------------------------- JSON UTILS --------------------------
// ---------------------------------------------------------------

const JSON_DIR = process.env.JSON_PATH || "./data/";

/**
 * Get the filename of a JSON operation
 * @param {String} operationId Operation ID
 * @returns {String} Filename of the JSON operation
 */
const getFilename = (operationId: string): string => path.resolve(".", `${JSON_DIR}${operationId}.json`);

/**
 * Check if a JSON object is empty
 * @param {Object} json JSON object
 * @returns {boolean} True if the JSON object is empty, false otherwise
 */
const isEmptyJson = (json: JSON): boolean => Object.keys(json).length === 0;

/**
 * Check if a string is a valid JSON
 * @param {String} content JSON content
 * @returns {boolean} True if the string is a valid JSON, false otherwise
 */
const isValidJson = (content: string): boolean => {
	try {
		JSON.parse(content);
		return true;
	} catch (error) {
		return false;
	}
};

/**
 * Check if a JSON operation exists
 * @param {String} operationId Operation ID
 * @returns {boolean} True if the JSON operation exists and is valid, false otherwise
 */
const checkIfExistJson = (operationId: string): boolean => {
	const filename = getFilename(operationId);
	try {
		if (fs.existsSync(filename)) {
			const fileContent = fs.readFileSync(filename, "utf8");
			return isValidJson(fileContent);
		}
	} catch (error) {
		LogError("🚀 ~ checkIfExistJson ~ error:", error as Error);
	}
	return false;
};

/**
 * Get all JSON files in the JSON directory
 * @returns {Promise<Array<Deposit>>} List of JSON files
 */
const getAllJsonOperations = async (): Promise<Array<Deposit>> => {
	const dirPath = path.resolve(".", JSON_DIR);

	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
	}

	const files = await fs.promises.readdir(dirPath);
	const jsonFiles = files.filter((file: JSON) => path.extname(file) === ".json");

	const promises = jsonFiles.map(async (file: JSON) => {
		const filePath = path.join(dirPath, file);
		const data = await fs.promises.readFile(filePath, "utf8");
		if (!isValidJson(data)) {
			LogError("🚀 ~ getAllOperations ~ Invalid JSON file:", filePath);
			return null;
		}
		return JSON.parse(data);
	});

	const results = await Promise.all(promises);
	// Clean null values
	return results.filter((result: Deposit) => result !== null);
};

/**
 * Get all JSON operations in the QUEUED state
 * @returns {Array} List of JSON operations in the QUEUED state
 */
const getAllJsonOperationsQueued = async (): Promise<Array<Deposit>> => {
	const operations = await getAllJsonOperations();
	return operations.filter((operation: Deposit) => operation.status === "QUEUED");
};

/**
 * Get all JSON operations in the FINALIZED state
 * @returns {Array} List of JSON operations in the FINALIZED state
 */
const getAllJsonOperationsFinalized = async (): Promise<Array<Deposit>> => {
	const operations = await getAllJsonOperations();
	return operations.filter((operation: Deposit) => operation.status === "FINALIZED");
};

/**
 * Get all JSON operations in the INITIALIZED state
 * @returns {Array} List of JSON operations in the INITIALIZED state
 */
const getAllJsonOperationsInitialized = async (): Promise<Array<Deposit>> => {
	const operations = await getAllJsonOperations();
	return operations.filter((operation: Deposit) => operation.status === "INITIALIZED");
};

// ---------------------------------------------------------------
// ------------------------- JSON CORE ---------------------------
// ---------------------------------------------------------------

/**
 * Get a JSON operation by its ID
 * @param {String} operationId Operation ID
 * @returns {Object|null} The JSON operation if it exists, null otherwise
 */
const getJsonById = (operationId: string): Deposit | null => {
	if (checkIfExistJson(operationId)) {
		try {
			const filename = getFilename(operationId);
			const fileContent = fs.readFileSync(filename, "utf8");
			return JSON.parse(fileContent);
		} catch (error) {
			LogError("🚀 ~ getJsonById ~ error:", error as Error);
		}
	}
	return null;
};

/**
 * Write a JSON object to a file
 * @param {Object} data JSON data
 * @param {String} operationId Operation ID
 * @returns {boolean} True if the JSON data was written successfully, false otherwise
 */
const writeJson = (data: Deposit, operationId: string): boolean => {
	const filename = getFilename(operationId);

	try {
		const json = JSON.stringify(data, null, 2);
		fs.writeFileSync(filename, json, "utf8");
		return true;
	} catch (error) {
		LogError("🚀 ~ writeJson ~ error:", error as Error);
		return false;
	}
};

/**
 * Create a new deposit and write it to a JSON file.
 * @param {FundingTransaction} fundingTx - The Bitcoin funding transaction.
 * @param {any} reveal - An array containing reveal parameters related to the Bitcoin deposit.
 * @param {any} l2DepositOwner - The owner of the deposit on the L2 network.
 * @param {any} l2Sender - The sender address on the L2 network.
 */

export const writeNewJsonDeposit = (fundingTx: FundingTransaction, reveal: any, l2DepositOwner: any, l2Sender: any) => {
	const deposit: Deposit = createDeposit(fundingTx, reveal, l2DepositOwner, l2Sender);
	writeJson(deposit, deposit.id);
};

/**
 * Delete a JSON operation by its ID
 * @param {String} operationId Operation ID
 * @returns {boolean} True if the JSON data was deleted successfully, false otherwise
 */
const deleteJson = (operationId: string): boolean => {
	const filename = getFilename(operationId);
	try {
		if (fs.existsSync(filename)) {
			fs.unlinkSync(filename);
			return true;
		}
	} catch (error) {
		LogError("🚀 ~ deleteJson ~ error:", error as Error);
	}
	return false;
};

export {
	// Utils
	isEmptyJson,
	isValidJson,
	checkIfExistJson,

	// JSON Core
	getJsonById,
	writeJson,
	deleteJson,
	getAllJsonOperations,
	getAllJsonOperationsQueued,
	getAllJsonOperationsFinalized,
	getAllJsonOperationsInitialized,
};

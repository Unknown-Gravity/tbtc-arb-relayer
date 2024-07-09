const fs = require("fs");
const path = require("path");
const { LogError } = require("./Logs");

// ---------------------------------------------------------------
// ------------------------- JSON UTILS --------------------------
// ---------------------------------------------------------------

const JSON_DIR = process.env.JSON_PATH || "./data/";

/**
 * Get the filename of a JSON operation
 * @param {String} operationId Operation ID
 * @returns {String} Filename of the JSON operation
 */
const getFilename = (operationId) =>
  path.resolve(".", `${JSON_DIR}${operationId}.json`);

/**
 * Check if a JSON object is empty
 * @param {Object} json JSON object
 * @returns {boolean} True if the JSON object is empty, false otherwise
 */
const isEmptyJson = (json) => Object.keys(json).length === 0;

/**
 * Check if a string is a valid JSON
 * @param {String} content JSON content
 * @returns {boolean} True if the string is a valid JSON, false otherwise
 */
const isValidJson = (content) => {
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
const checkIfExistJson = (operationId) => {
  const filename = getFilename(operationId);
  try {
    if (fs.existsSync(filename)) {
      const fileContent = fs.readFileSync(filename, "utf8");
      return isValidJson(fileContent);
    }
  } catch (error) {
    LogError("🚀 ~ checkIfExistJson ~ error:", error);
  }
  return false;
};

/**
 * Get all JSON files in the JSON directory
 * @returns {Array} List of JSON files
 */
const getAllJsonOperations = async () => {
  const dirPath = path.resolve(".", JSON_DIR);
  const files = await fs.promises.readdir(dirPath);
  const jsonFiles = files.filter((file) => path.extname(file) === ".json");

  const promises = jsonFiles.map(async (file) => {
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
  return results.filter((result) => result !== null);
};

/**
 * Get all JSON operations in the QUEUED state
 * @returns {Array} List of JSON operations in the QUEUED state
 */
const getAllJsonOperationsQueued = async () => {
  const operations = await getAllJsonOperations();
  return operations.filter((operation) => operation.status === "QUEUED");
};

/**
 * Get all JSON operations in the FINALIZED state
 * @returns {Array} List of JSON operations in the FINALIZED state
 */
const getAllJsonOperationsFinalized = async () => {
  const operations = await getAllJsonOperations();
  return operations.filter((operation) => operation.status === "FINALIZED");
};

/**
 * Get all JSON operations in the INITIALIZED state
 * @returns {Array} List of JSON operations in the INITIALIZED state
 */
const getAllJsonOperationsInitialized = async () => {
  const operations = await getAllJsonOperations();
  return operations.filter((operation) => operation.status === "INITIALIZED");
};

// ---------------------------------------------------------------
// ------------------------- JSON CORE ---------------------------
// ---------------------------------------------------------------

/**
 * Get a JSON operation by its ID
 * @param {String} operationId Operation ID
 * @returns {Object|null} The JSON operation if it exists, null otherwise
 */
const getJsonById = (operationId) => {
  if (checkIfExistJson(operationId)) {
    try {
      const filename = getFilename(operationId);
      const fileContent = fs.readFileSync(filename, "utf8");
      return JSON.parse(fileContent);
    } catch (error) {
      LogError("🚀 ~ getJsonById ~ error:", error);
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
const writeJson = (data, operationId) => {
  const filename = getFilename(operationId);
  try {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filename, json, "utf8");
    return true;
  } catch (error) {
    LogError("🚀 ~ writeJson ~ error:", error);
    return false;
  }
};

/**
 * Delete a JSON operation by its ID
 * @param {String} operationId Operation ID
 * @returns {boolean} True if the JSON data was deleted successfully, false otherwise
 */
const deleteJson = (operationId) => {
  const filename = getFilename(operationId);
  try {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
      return true;
    }
  } catch (error) {
    LogError("🚀 ~ deleteJson ~ error:", error);
  }
  return false;
};

module.exports = {
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

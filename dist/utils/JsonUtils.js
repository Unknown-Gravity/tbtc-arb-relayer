"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJsonOperationsInitialized = exports.getAllJsonOperationsFinalized = exports.getAllJsonOperationsQueued = exports.getAllJsonOperations = exports.deleteJson = exports.writeJson = exports.getJsonById = exports.checkIfExistJson = exports.isValidJson = exports.isEmptyJson = void 0;
const Logs_1 = require("./Logs");
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
const getFilename = (operationId) => path.resolve(".", `${JSON_DIR}${operationId}.json`);
/**
 * Check if a JSON object is empty
 * @param {Object} json JSON object
 * @returns {boolean} True if the JSON object is empty, false otherwise
 */
const isEmptyJson = (json) => Object.keys(json).length === 0;
exports.isEmptyJson = isEmptyJson;
/**
 * Check if a string is a valid JSON
 * @param {String} content JSON content
 * @returns {boolean} True if the string is a valid JSON, false otherwise
 */
const isValidJson = (content) => {
    try {
        JSON.parse(content);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.isValidJson = isValidJson;
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
    }
    catch (error) {
        (0, Logs_1.LogError)("🚀 ~ checkIfExistJson ~ error:", error);
    }
    return false;
};
exports.checkIfExistJson = checkIfExistJson;
/**
 * Get all JSON files in the JSON directory
 * @returns {Promise<Array<Deposit>>} List of JSON files
 */
const getAllJsonOperations = () => __awaiter(void 0, void 0, void 0, function* () {
    const dirPath = path.resolve(".", JSON_DIR);
    const files = yield fs.promises.readdir(dirPath);
    const jsonFiles = files.filter((file) => path.extname(file) === ".json");
    const promises = jsonFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = path.join(dirPath, file);
        const data = yield fs.promises.readFile(filePath, "utf8");
        if (!isValidJson(data)) {
            (0, Logs_1.LogError)("🚀 ~ getAllOperations ~ Invalid JSON file:", filePath);
            return null;
        }
        return JSON.parse(data);
    }));
    const results = yield Promise.all(promises);
    // Clean null values
    return results.filter((result) => result !== null);
});
exports.getAllJsonOperations = getAllJsonOperations;
/**
 * Get all JSON operations in the QUEUED state
 * @returns {Array} List of JSON operations in the QUEUED state
 */
const getAllJsonOperationsQueued = () => __awaiter(void 0, void 0, void 0, function* () {
    const operations = yield getAllJsonOperations();
    return operations.filter((operation) => operation.status === "QUEUED");
});
exports.getAllJsonOperationsQueued = getAllJsonOperationsQueued;
/**
 * Get all JSON operations in the FINALIZED state
 * @returns {Array} List of JSON operations in the FINALIZED state
 */
const getAllJsonOperationsFinalized = () => __awaiter(void 0, void 0, void 0, function* () {
    const operations = yield getAllJsonOperations();
    return operations.filter((operation) => operation.status === "FINALIZED");
});
exports.getAllJsonOperationsFinalized = getAllJsonOperationsFinalized;
/**
 * Get all JSON operations in the INITIALIZED state
 * @returns {Array} List of JSON operations in the INITIALIZED state
 */
const getAllJsonOperationsInitialized = () => __awaiter(void 0, void 0, void 0, function* () {
    const operations = yield getAllJsonOperations();
    return operations.filter((operation) => operation.status === "INITIALIZED");
});
exports.getAllJsonOperationsInitialized = getAllJsonOperationsInitialized;
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
        }
        catch (error) {
            (0, Logs_1.LogError)("🚀 ~ getJsonById ~ error:", error);
        }
    }
    return null;
};
exports.getJsonById = getJsonById;
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
    }
    catch (error) {
        (0, Logs_1.LogError)("🚀 ~ writeJson ~ error:", error);
        return false;
    }
};
exports.writeJson = writeJson;
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
    }
    catch (error) {
        (0, Logs_1.LogError)("🚀 ~ deleteJson ~ error:", error);
    }
    return false;
};
exports.deleteJson = deleteJson;

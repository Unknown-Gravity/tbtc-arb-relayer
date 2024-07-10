"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require("express");
const Operations_controller_1 = __importDefault(require("../controllers/Operations.controller"));
const Utils_controller_1 = __importDefault(require("../controllers/Utils.controller"));
exports.router = express.Router();
const utils = new Utils_controller_1.default();
const operations = new Operations_controller_1.default();
// Default route for the API
exports.router.get("/", utils.defaultController);
// Ping route for the API
exports.router.get("/status", utils.pingController);
// Diagnostic route for the API
exports.router.get("/diagnostic", operations.getAllOperations);
// Test route
exports.router.get("/test", utils.test);
exports.default = exports.router;

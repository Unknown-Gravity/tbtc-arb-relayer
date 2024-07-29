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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomResponse_helper_1 = __importDefault(require("../helpers/CustomResponse.helper"));
const JsonUtils_1 = require("../utils/JsonUtils");
const Logs_1 = require("../utils/Logs");
class Operations {
    constructor() {
        this.getAllOperations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = new CustomResponse_helper_1.default(res);
            try {
                const operations = yield (0, JsonUtils_1.getAllJsonOperations)();
                return response.ok("All ok", operations);
            }
            catch (err) {
                (0, Logs_1.LogError)("🚀 ~ getAllOperations ~ err:", err);
                return response.ko(err.message);
            }
        });
    }
}
exports.default = Operations;

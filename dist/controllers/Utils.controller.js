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
const Logs_1 = require("../utils/Logs");
const FinalizeDeposits_1 = require("../services/FinalizeDeposits");
// const Response = require("../helpers/Response.helper");
// const { finalizeDeposit } = require("../services/FinalizeDeposits.ts");
// const { LogError } = require("../utils/Logs");
class Utils {
    constructor() {
        /**
         * @name defaultController
         * @description Default controller
         * @method GET
         * @returns {Object} API information
         */
        this.defaultController = (req, res) => {
            const response = new CustomResponse_helper_1.default(res);
            // Get API version
            const version = process.env.APP_VERSION || "1.0.0";
            // Get API name
            const name = process.env.APP_NAME || "Unknown API";
            // Send response
            response.ok("API Information: ", {
                name,
                version,
            });
        };
        /**
         * @name pingController
         * @description Check if API is running
         * @method GET
         * @returns {Object} API status
         **/
        this.pingController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = new CustomResponse_helper_1.default(res);
            try {
                response.ok();
            }
            catch (err) {
                (0, Logs_1.LogError)("🚀 ~ pingController ~ err:", err);
                return response.ko(err.message);
            }
        });
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = new CustomResponse_helper_1.default(res);
            try {
                (0, FinalizeDeposits_1.finalizeDeposit)();
                response.ok("Todo ok");
            }
            catch (error) { }
        });
    }
}
exports.default = Utils;

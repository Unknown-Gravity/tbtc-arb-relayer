"use strict";
/*
That will finalize INITIALIZED deposits in the L1BitcoinDepositor contract.

This task should:
- Fetch all INITIALIZED deposits from the persistent storage.
- For each deposit, check if it is already finalized in the L1BitcoinDepositor contract (using the L1BitcoinDepositor.deposits call):
- If not finalized, check finalization possibility (by executing a pre-flight call to L1BitcoinDepositor.finalizeDeposit)
- If finalization is possible, call L1BitcoinDepositor.finalizeDeposit and update the internal deposit’s state to FINALIZED.
- If finalization is not possible, do nothing.
- If already finalized, don’t call the contract and just update the internal deposit’s state to FINALIZED (corner case when deposit was finalized outside the relayer).

More info: https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
*/
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
exports.finalizeDeposit = void 0;
const JsonUtils_1 = require("../utils/JsonUtils");
const Logs_1 = require("../utils/Logs");
const cron = require("node-cron");
const { checkAndWriteJson } = require("./FinalizeDepositServices/CheckAndWriteJson.js");
// const { LogError } = require("../utils/Logs.js");
const finalizeDeposit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const initializedDeposits = yield (0, JsonUtils_1.getAllJsonOperationsInitialized)();
        const promises = initializedDeposits.map((deposit) => __awaiter(void 0, void 0, void 0, function* () {
            checkAndWriteJson(deposit);
        }));
        yield Promise.all(promises);
    }
    catch (error) {
        (0, Logs_1.LogError)("", error);
    }
});
exports.finalizeDeposit = finalizeDeposit;
//CronJobs
cron.schedule("* * * * *", () => {
    (0, exports.finalizeDeposit)();
});

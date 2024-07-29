"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestContract = exports.L2BitcoinDepositor = exports.L1BitcoinDepositor = void 0;
const ethers_1 = require("ethers");
const L1BitcoinDepositor_1 = require("../interfaces/L1BitcoinDepositor");
const L2BitcoinDepositor_1 = require("../interfaces/L2BitcoinDepositor");
const TestContract_1 = require("../interfaces/TestContract");
// const { finalizeDeposit } = require("./FinalizeDeposits.js");
// ---------------------------------------------------------------
// Environment Variables
const ArbitrumRPC = process.env.ArbitrumRPC || "";
const EthereumRPC = process.env.EthereumRPC || "";
const L1BitcoinDepositor_Address = process.env.L1BitcoinDepositor || "";
const L2BitcoinDepositor_Address = process.env.L2BitcoinDepositor || "";
const TestContract_Address = process.env.TestContract || "";
// Provider
const providerArb = new ethers_1.ethers.providers.JsonRpcProvider(ArbitrumRPC);
const providerEth = new ethers_1.ethers.providers.JsonRpcProvider(EthereumRPC);
// Contracts
exports.L1BitcoinDepositor = new ethers_1.ethers.Contract(L1BitcoinDepositor_Address, L1BitcoinDepositor_1.L1BitcoinDepositorABI, providerEth);
exports.L2BitcoinDepositor = new ethers_1.ethers.Contract(L2BitcoinDepositor_Address, L2BitcoinDepositor_1.L2BitcoinDepositorABI, providerArb);
exports.TestContract = new ethers_1.ethers.Contract(TestContract_Address, TestContract_1.TestContractABI, providerEth);
// Events
// Hay que encontrar la forma de añadir un listener a L2BitcoinDepositor para el evento de initializer
// L2BitcoinDepositor.on("DepositInitialized", (fundingTx, reveal, l2DepositOwner, l2Sender) => {
// 	console.log("I pressed the button!!");
// });
// ---------------------------------------------------------------

import { ethers } from "ethers";
import { L1BitcoinDepositorABI } from "../interfaces/L1BitcoinDepositor";
import { L2BitcoinDepositorABI } from "../interfaces/L2BitcoinDepositor";
import { TestContractABI } from "../interfaces/TestContract";
import { finalizeDeposit } from "./FinalizeDeposits";
import cron from "node-cron";
// ---------------------------------------------------------------

// Environment Variables
const ArbitrumRPC: string = process.env.ArbitrumRPC || "";
const EthereumRPC: string = process.env.EthereumRPC || "";
const L1BitcoinDepositor_Address: string = process.env.L1BitcoinDepositor || "";
const L2BitcoinDepositor_Address: string = process.env.L2BitcoinDepositor || "";
const TestContract_Address: string = process.env.TestContract || "";

// Provider
const providerArb: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(ArbitrumRPC);

const providerEth: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(EthereumRPC);

// Contracts

export const L1BitcoinDepositor: ethers.Contract = new ethers.Contract(
	L1BitcoinDepositor_Address,
	L1BitcoinDepositorABI,
	providerEth
);
export const L2BitcoinDepositor: ethers.Contract = new ethers.Contract(
	L2BitcoinDepositor_Address,
	L2BitcoinDepositorABI,
	providerArb
);
export const TestContract: ethers.Contract = new ethers.Contract(TestContract_Address, TestContractABI, providerEth);

// FundingTX will be a type
// Reveal will be a type
// L2DepositOwner will be a string
// L2 Sender will be a number

export const startCronJobs = () => {
	//CRONJOBS
	console.log("Starting cron job setup...");

	cron.schedule("* * * * *", () => {
		finalizeDeposit();
		console.log("Finalized Deposits!");
	});

	console.log("Cron job setup complete.");
};

// ---------------------------------------------------------------

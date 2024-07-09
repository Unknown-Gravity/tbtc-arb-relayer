const { ethers } = require("ethers");
const { L1BitcoinDepositorABI } = require("../interfaces/L1BitcoinDepositor");
const { L2BitcoinDepositorABI } = require("../interfaces/L2BitcoinDepositor");

// ---------------------------------------------------------------

// Environment Variables
const RPC = process.env.ArbitrumRPC;
const L1BitcoinDepositor_Address = process.env.L1BitcoinDepositor;
const L2BitcoinDepositor_Address = process.env.L2BitcoinDepositor;

// Provider
const provider = new ethers.providers.JsonRpcProvider(RPC);

// Contracts
const L1BitcoinDepositor = new ethers.Contract(
  L1BitcoinDepositor_Address,
  L1BitcoinDepositorABI,
  providerEth
);
const L2BitcoinDepositor = new ethers.Contract(
  L2BitcoinDepositor_Address,
  L2BitcoinDepositorABI,
  providerArb
);

// Events
// Hay que encontrar la forma de añadir un listener a L2BitcoinDepositor para el evento de initializer
L2BitcoinDepositor.on(
  "DepositInitialized",
  (fundingTx, reveal, l2DepositOwner, l2Sender) => {
    console.log("I pressed the button!!");
  }
);

module.exports = {
  L1BitcoinDepositor,
  L2BitcoinDepositor,
};

// ---------------------------------------------------------------

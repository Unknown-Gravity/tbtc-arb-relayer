import { L1BitcoinDepositor } from "./Core";

const checkFinalizeStatus = (operationId) => {
  const status = L1BitcoinDepositor.deposits(operationId);
  return status === "FINALIZED";
};

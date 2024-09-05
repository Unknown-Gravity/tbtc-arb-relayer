const express = require("express");

import Operations from "../controllers/Operations.controller";
import Utils from "../controllers/Utils.controller";

export const router = express.Router();

// Controllers
const utils = new Utils();
const operations = new Operations();

// Default route for the API
router.get("/", utils.defaultController);

// Ping route for the API
router.get("/status", utils.pingController);

// Diagnostic route for the API
router.get("/diagnostics", operations.getAllOperations);
router.get("/diagnostics/queued", operations.getAllQueuedOperations);
router.get("/diagnostics/initialized", operations.getAllInitializedOperations);
router.get("/diagnostics/finalized", operations.getAllFinalizedOperations);

export default router;
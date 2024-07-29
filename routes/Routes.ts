const express = require("express");

import Operations from "../controllers/Operations.controller";
import Utils from "../controllers/Utils.controller";

export const router = express.Router();
const utils = new Utils();
const operations = new Operations();
// Default route for the API
router.get("/", utils.defaultController);

// Ping route for the API
router.get("/status", utils.pingController);

// Diagnostic route for the API
router.get("/diagnostic", operations.getAllOperations);

router.get("/test", utils.test);

export default router;

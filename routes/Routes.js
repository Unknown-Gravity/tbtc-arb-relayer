const express = require("express");
const Utils = require("../controllers/Utils.controller");
const Operations = require("../controllers/Operations.controller");

const router = express.Router();

// Default route for the API
router.get("/", Utils.defaultController);

// Ping route for the API
router.get("/status", Utils.pingController);

// Diagnostic route for the API
router.get("/diagnostic", Operations.getAllOperations);

// Test route
router.get("/test", Utils.test);

module.exports = router;

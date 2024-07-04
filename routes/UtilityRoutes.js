const express = require("express");
const { defaultController, pingController } = require("../controllers/Utils.controller");

const router = express.Router();

// Default route for the API
router.get("/", defaultController);

// Ping route for the API
router.get("/ping", pingController);

module.exports = router;

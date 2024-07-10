"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// -------------------------------------------------------------------------
// |                              IMPORTS                                  |
// -------------------------------------------------------------------------
// Express Server
const express_1 = __importDefault(require("express"));
// Security
// import cors from 'cors';
const helmet_1 = __importDefault(require("helmet"));
// Compression
const compression_1 = __importDefault(require("compression"));
// Rutas
const Routes_1 = __importDefault(require("./routes/Routes"));
// Utils
const Logs_1 = require("./utils/Logs");
// -------------------------------------------------------------------------
// |                            APP CONFIG                                 |
// -------------------------------------------------------------------------
// Express app
const app = (0, express_1.default)();
// Port
const PORT = parseInt(process.env.APP_PORT || "3333", 10);
app.set("port", PORT);
// -------------------------------------------------------------------------
// |                              SECURITY                                 |
// -------------------------------------------------------------------------
// CORS
// app.use(
// 	cors({
// 		credentials: true,
// 		origin: process.env.APP_URL, // true para local? Compatibilidad con navegadores
// 	})
// );
// Helmet (Security middleware)
app.use((0, helmet_1.default)());
// Deshabilitar la cabecera X-Powered-By
app.disable("x-powered-by");
// -------------------------------------------------------------------------
// |                              COMPRESSION                              |
// -------------------------------------------------------------------------
// Compresion
app.use((0, compression_1.default)());
// File Upload limit
app.use(express_1.default.json({ limit: "2048mb" }));
app.use(express_1.default.urlencoded({ limit: "2048mb", extended: true }));
// -------------------------------------------------------------------------
// |                                 ROUTES                                |
// -------------------------------------------------------------------------
app.use(Routes_1.default);
// -------------------------------------------------------------------------
// |                              SERVER START                             |
// -------------------------------------------------------------------------
app.listen(PORT, () => {
    (0, Logs_1.LogMessage)(`Server running on port ${PORT}`);
    (0, Logs_1.LogMessage)(`API: ${process.env.API_URL}`);
});

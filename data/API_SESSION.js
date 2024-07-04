// Session options
const { Store } = require("express-session");

// Database
const SequelizeStore = require("connect-session-sequelize");
const db = require("../database/config/Database");
const { IS_PRODUCTION } = require("./API_DOCS_INFO");

const sessionStore = SequelizeStore(Store);

// Sesiones
const SESSION_STORE = new sessionStore({
    db: db,
});

const SESSION_OPTIONS = {
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    store: SESSION_STORE,
    cookie: {
        secure: "auto",
        sameSite: true,
        maxAge: 60 * 60 * 24 * 1000,
    },
};

// Compatibilidad con Chrome, Firefox y Safari
if (IS_PRODUCTION) {
    SESSION_OPTIONS.cookie.secure = true;
    SESSION_OPTIONS.proxy = true;
}

module.exports = {
    SESSION_STORE,
    SESSION_OPTIONS,
};

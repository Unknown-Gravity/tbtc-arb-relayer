const { Sequelize } = require("sequelize");
const mariadb = require("mariadb");

// Uncomment this line if you are using mysql2
//const mysql2 = require("mysql2");

/**
 * @file Database.js
 * @description Database configuration file
 **/
const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    dialectModule: mariadb, //mysql2,
});

module.exports = db;

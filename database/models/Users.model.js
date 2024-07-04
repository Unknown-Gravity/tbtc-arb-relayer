const { DataTypes } = require("sequelize");
const db = require("../config/Database.js");

/**
 * @file Users.model.js
 * @description Sequelize model for users table relation in database
 * @author Unknown Gravity | All-in-one Blockchain Company
 * @todo Add more fields
 * @todo Add more validations
 */
const Users = db.define(
    "Users",
    {
        userId: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: [4,16]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM,
            values: ["user", "admin"],
            defaultValue: "user",
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        paranoid: true,
    }
);

module.exports = Users;

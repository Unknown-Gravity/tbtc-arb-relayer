const Response = require("../helpers/Response.helper.js");

/**********************************************************
 * @file AuthUsers.js
 * @description Middleware for user authentication
 * @module Middleware/AuthUsers
 * @author Unknown Gravity | All-in-one Blockchain Company
 * @version 0.0.1
 *********************************************************/

/**
 * @name verifyUser
 * @description Verify if user is logged in
 * @method GET
 * @returns {Object} User
 */
const verifyUser = async (req, res, next) => {
    const response = new Response(res);
    if (!req.session.userId) return response.ko("Need to login");

    // const user = await Users.findByPk(req.session.userId)
    // if (!user) return response.ko('Usuario no encontrado')

    next();
};

module.exports = { verifyUser };

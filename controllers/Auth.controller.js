const Response = require("../helpers/Response.helper.js");
const { getUserPassword, getFullUser } = require("../services/Users/Users.js");
const { LogError } = require("../utils/Logs.js");
const { checkHash } = require("../utils/Passwords.js");

/*************************************************
 * @file Auth.controller.js
 * @description Controller for auth routes
 * @module Controller/Auth
 * @requires module:Database/Models/Users
 * @requires module:Helpers/Response
 * @requires module:Utils/Passwords
 * @author JSanchezFDZ | All-in-one Blockchain Company
 * @version 0.0.1
 *************************************************/

/**
 * @name Login
 * @description User login to the platform with username
 * @method POST
 * @returns {Object} User
 * @author JSanchezFDZ | All-in-one Blockchain Company
 * @version 0.0.1
 */
const Login = async (req, res) => {
    const response = new Response(res);

    const { username: postUsername, password } = req.body;

    try {
        let user = await getUserPassword(postUsername);
        if (!user) return response.ko("User not found.");

        const match = await checkHash(password, user.password);
        if (!match) return response.ko("Wrong password.");

        // ---------------------------------------------------------------
        // Guardar aquí todos los valores de sesión necesarios
        // ---------------------------------------------------------------
        user = getFullUser(user.userId);

        const { userId, username, email, isVerified, role } = user;

        req.session.userId = userId;
        req.session.username = username;
        req.session.email = email;
        req.session.isVerified = isVerified;
        req.session.role = role;
        // ---------------------------------------------------------------

        return response.ok("Login successful.", user);
    } catch (err) {
        LogError("Auth.controller.js -> Login ->", err);
        return response.ko(err.message);
    }
};

/**
 * @name Me
 * @description Get the user data from the session
 * @method GET
 * @returns {Object} User
 * @requires session
 * @requires session.username
 */
const Me = async (req, res) => {
    const response = new Response(res);

    try {
        if (!req.session.userId) return response.ko("Need to login.");

        // ---------------------------------------------------------------
        // Actualizar aquí los datos de sesión necesarios
        // ---------------------------------------------------------------

        const user = await getFullUser(req.session.userId);
        if(!user) return response.ko("User not found.");

        // ---------------------------------------------------------------

        response.ok("You are logged in.", user);
    } catch (err) {
        LogError("Auth.controller.js -> Me ->", err);
        return response.ko(err.message);
    }
};

/**
 * @name Logout
 * @description User logout from the platform
 * @method DELETE
 * @returns {Object} User
 * @requires session
 */
const Logout = async (req, res) => {
    const response = new Response(res);

    req.session.destroy((err) => {
        if (err) {
            LogError("Auth.controller.js -> Logout ->", err);
            return response.ko("Error while logging out.");
        }
        res.clearCookie(process.env.SESSION_NAME);

        return response.ok("Logged out.");
    });
};

// ---------------------------------------------------------------
// --------------------- EXPORT MODULE ---------------------------
// ---------------------------------------------------------------
module.exports = {
    Login,
    Me,
    Logout,
};

const Users = require("../../database/models/Users.model");

/**
 * @name getUserPassword
 * @description Get the user password from the database
 * @param {String} usernameOrEmail
 * @returns {String} password
 **/
const getUserPassword = async (usernameOrEmail) => {
    const user = await Users.findOne({
        where: {
            [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
        attributes: ["userId", "password"],
    });

    if (!user) return false;
    return user;
};

/**
 * @name getFullUser
 * @description Get the full user data from the database
 * @param {String} usernameOrEmail
 * @returns {Object} user
 **/
const getFullUser = async (userId) => {
    const user = await Users.findByPk(userId);
    if (!user) return false;

    delete user.dataValues.password;
    return user;
};

module.exports = {
    getUserPassword,
    getFullUser,
};

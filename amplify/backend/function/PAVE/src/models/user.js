const Sequelize = require('sequelize');
const database = require("../utils/database.js")

const User = database.define('users', {
	idUser: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	first_name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	last_name: {
		type: Sequelize.STRING,
		allowNull: false
	},
});

module.exports = User;
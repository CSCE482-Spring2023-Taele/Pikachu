const Sequelize = require('sequelize');
const database = require("../utils/database.js")
const User = require("./user.js");

const Obstruction = database.define('obstructions', {
	idObstructions: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	idUser: {
		type: Sequelize.INTEGER,
		allowNull: true,
		references: {
			model: User,
			id: "idUser"
		}
	},
	latitude: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	longitude: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
	},
	exp_date: {
		type: Sequelize.DATE,
	},
	type: {
		type: Sequelize.STRING,
	},
	imageName: {
		type: Sequelize.STRING,
	},
	imagePath: {
		type: Sequelize.STRING,
	},
	remove_request_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	}
}, {timestamps: false});

module.exports = Obstruction;
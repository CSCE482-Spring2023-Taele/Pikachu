const Sequelize = require('sequelize');
const database = require("../utils/database.js")
const User = require("./user.js");

const SavedLocation = database.define('saved_locations', {
	idsaved_locations: {
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
	num_times: {
		type: Sequelize.INTEGER
	},
}, {timestamps: false});

module.exports = SavedLocation;
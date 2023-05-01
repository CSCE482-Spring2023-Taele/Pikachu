const Sequelize = require('sequelize');

var database;
if (process.env.NODE_ENV === "development") {
	database = new Sequelize({
		logging: console.log,
		dialect: "sqlite",
		storage: "./utils/dev-database.db"
	});
} else {
	// removed username and password
	database = new Sequelize('PaveDB', 'username', 'password', {
		dialect: 'mysql',
		host: 'database-1.c2cjurrfvgzf.us-east-2.rds.amazonaws.com',
		port: 3306,
		define: {
			timestamps: false
		}
	});
}

database.authenticate().then(() => {
	console.log('Connection has been established successfully.');
}).catch((error) => {
	console.error('Unable to connect to the database: ', error);
});

module.exports = database
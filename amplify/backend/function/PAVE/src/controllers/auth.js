const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const SavedLocation = require("../models/saved_location.js");
const Obstruction = require("../models/obstruction.js");
const { obstructions } = require("./report.js");
const client = new OAuth2Client("client");
// changed oauth2client
var login = function (req, res, next){
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return res.status(401).json({ message: 'not authenticated' });
	};
	const token = authHeader.split(' ')[1];

	client.verifyIdToken({
		idToken: token,
		audience: 'audience',
	}).then((response) => {
		// token is not expired
		console.log("valid google token")
		// checks if email already exists
		User.findOne({where : {
			email: req.body.email,
		}})
		.then(dbUser => {
			if (dbUser) {
				// user already in db, return token
				// changed secret key
				const token = jwt.sign({ idUser: dbUser.idUser }, 'super secret key you dont know about', {expiresIn: '5h'});
				console.log(token)
				return res.status(200).json({message: "user logged in", token: token})
			}
			else if (req.body.email && req.body.first_name && req.body.last_name) {
				//user was not found, need to insert into db
				return User.create(({
					email: req.body.email,
					first_name: req.body.first_name,
					last_name: req.body.last_name,
				}))
				.then((newUser) => {
					// changed secret key
					const token = jwt.sign({ idUser: newUser.idUser }, 'super secret key you dont know about', {expiresIn: '5h'});
					res.status(200).json({message: "user logged in", token: token});
				});
			}
			else if (!req.body.email) {
				return res.status(400).json({message: "email not provided"});
			}
			else if (!req.body.first_name) {
				return res.status(400).json({message: "first name not provided"});
			}
			else if (!req.body.last_name) {
				return res.status(400).json({message: "last name not provided"});
			}
		})
		.catch(err => {
			console.log('sign in error', err);
		});
	}).catch((error) => {
		// token is expired and or google is down
		res.status(401).json({ message: 'invalid google token' });
	});
};

// may need to change this!!
const isAuth = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return res.status(401).json({ message: 'not authenticated' });
	};
	const token = authHeader.split(' ')[1];
	let decodedToken; 
	try {
		decodedToken = jwt.verify(token, 'secret');
		req.body.idUser = decodedToken.idUser;
	} catch (err) {
		return res.status(500).json({ message: err.message || 'could not decode the token' });
	};
	if (!decodedToken) {
		res.status(401).json({ message: 'unauthorized' });
	} else {
		next();
	};
};

const deactivate = (req, res, next) => {
	const idUser = req.body.idUser;
	Obstruction.findAll({where: {
		idUser : idUser
	}})
	.then(obstructions => {
		for (index in obstructions) {
			obstructions[index].update({idUser: null})
		}
	})
	.catch(err => {
		console.log("error in deactivate function", err);
	})
	
	SavedLocation.destroy({
		where: {
			idUser: idUser
		}
	})
	.then(deleted => {
		console.log(deleted)
	})
	.catch(err => {
		console.log("error in deactivate function", err);
	})
	
	User.destroy({
		where: {
			idUser: idUser
		}
	})
	.then(deletedUser => {
		if (deletedUser === 1) {
			console.log(deletedUser)
			res.status(200).json({message: "deleted successfully"});
		} else {
			res.status(404).json({message: "user not found"});
		}
	})
	.catch(err => {
		console.log("error in deactivate function", err);
	});
	
};




module.exports = {
	login,
	isAuth,
	deactivate,
}
const User = require("../models/user.js");
const SavedLocation = require("../models/saved_location.js");

const profile = (req, res) => {
	const idUser = req.body.idUser;
	User.findByPk(idUser, {
		include: [
			{
				model: SavedLocation,
				attributes: { exclude: ["idUser"] }
			}
		],
		attributes: { exclude: ["idUser"] }
	})
	.then(dbUser => {
		if (!dbUser) {
			return res.status(404).json({message: "user not found"});
		} else {
			res.status(200).json(dbUser.toJSON());
		}
	})
	.catch(err => {
		console.log("error in profile fuction", err);
	});
};

const edit_profile = (req, res) => {
	const idUser = req.body.idUser;
	User.findByPk(idUser)
	.then(dbUser => {
		if (!dbUser) {
			return res.status(404).json({message: "user not found"});
		} else {
			if (req.body.email && req.body.first_name && req.body.last_name) {
				dbUser.update({
					email: req.body.email,
					first_name: req.body.first_name,
					last_name: req.body.last_name,
				});
				var dbUserResp = dbUser.toJSON();
				delete dbUserResp.idUser;
				res.status(200).json(dbUserResp);
			} else {
				res.status(400).json({message: "missing information"});
			}
		}
	})
	.catch(err => {
		console.log("error in profile fuction", err);
	});
}

module.exports = { profile, edit_profile };
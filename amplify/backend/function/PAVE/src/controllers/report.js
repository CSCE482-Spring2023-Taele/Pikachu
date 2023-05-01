const Obstruction = require("../models/obstruction.js");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const all_obstructions = (req, res) => {
	const idUser = req.body.idUser;

	Obstruction.findAll({
		attributes: { exclude: ["idUser"] }
	})
	.then(obstructions => {
		let result = []
		const date = new Date().getTime();
		obstructions.forEach(obstruction => {
			if (Date.parse(obstruction["exp_date"]) < date) {
				Obstruction.destroy({
					where: {
						idObstructions: obstruction["idObstructions"]
					}
				})
			} else {
				result.push(obstruction);
			}
		});
		res.status(200).json(result);
	})
	.catch(err => {
		console.log("error in save locations function", err);
	});
}

const obstructions = (req, res) => {
	const idUser = req.body.idUser;
	const bottomLeftLat = parseFloat(req.body.bottomLeftLat);
	const bottomLeftLong = parseFloat(req.body.bottomLeftLong);
	const topRightLat = parseFloat(req.body.topRightLat);
	const topRightLong = parseFloat(req.body.topRightLong);

	Obstruction.findAll({
		where: {
			[Op.and]: [
				Sequelize.where(
					Sequelize.cast(Sequelize.col("latitude"), "float"), 			// PROD: FLOAT, DEV: REAL
					{
						[Op.gte]: bottomLeftLat,
						[Op.lte]: topRightLat
					}
				),
				Sequelize.where(
					Sequelize.cast(Sequelize.col("longitude"), "float"),
					{
						[Op.gte]: bottomLeftLong,
						[Op.lte]: topRightLong
					}
				)
			]
		},
		attributes: { exclude: ["idUser"] }
	})
	.then(obstructions => {
		let result = []
		const date = new Date().getTime();
		obstructions.forEach(obstruction => {
			if (Date.parse(obstruction["exp_date"]) < date) {
				Obstruction.destroy({
					where: {
						idObstructions: obstruction["idObstructions"]
					}
				})
			} else {
				result.push(obstruction);
			}
		});
		res.status(200).json(result);
	})
	.catch(err => {
		console.log("error in save locations function", err);
	});
}

const report = (req, res) => {
	const idUser = req.body.idUser;
	const latitude = req.body.latitude;
	const longitude = req.body.longitude;
	const type = req.body.type;
	const description = req.body.description;
	var exp_date = new Date();
	exp_date.setDate(exp_date.getDate() + 1);

	Obstruction.create({
		idUser: idUser,
		latitude: latitude,
		longitude: longitude,
		description: description,
		type: type,
		exp_date: exp_date,
		remove_request_count: 0
	})
	.then(newObstruction => {
		if (newObstruction) {
			const obstruction = newObstruction.toJSON();
			delete obstruction["idUser"]
			return res.status(200).json({message: "obstruction saved", obstruction: obstruction});
		} else {
			return res.status(400).json({message: "failed to save obstruction"});
		}
	})
	.catch(err => {
		console.log("error in save location function", err);
	});
};

const remove_report = (req, res) => {
	const idObstructions = req.body.idObstructions;

	Obstruction.findByPk(idObstructions)
	.then(obstruction => {
		if (!obstruction) {
			return res.status(400).json({message: "obstruction not found"});
		}
		obstruction.increment("remove_request_count", { by: 1 });
		obstruction.reload()
		.then(obstruction => {
			if (obstruction["remove_request_count"] >= 5) {					// THRESHOLD VALUE TO BE DETERMINED WITH TEAM
				Obstruction.destroy({
					where: {
						idObstructions: idObstructions
					}
				})
				.then(deletedObstruction => {
					if (deletedObstruction === 1) {
						res.status(200).json({message: `deleted successfully. obstruction has been requested to be removed ${obstruction["remove_request_count"]} times`, deletedObstruction: true});
					} else {
						res.status(404).json({message: "failed to delete obstruction", deletedObstruction: false});
					}
				})
			} else {
				res.status(200).json({message: `obstruction has been requested to be removed ${obstruction["remove_request_count"]} times`, deletedObstruction: false});
			}
		})
	})
	.catch(err => {
		console.log("error in remove report function", err);
	});
}

module.exports = { all_obstructions, obstructions, report, remove_report };
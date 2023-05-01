const SavedLocation = require("../models/saved_location.js");

const saved_locations = (req, res) => {
	const idUser = req.body.idUser;
	SavedLocation.findAll({
		where: {
			idUser: idUser
		},
		attributes: { exclude: ["idUser"] }
	})
	.then(savedLocations => {
		if (savedLocations) {
			res.status(200).json(savedLocations);
		}
		else {
			res.status(400).json({message: "failed to retrieve saved locations for user"})
		}
	})
	.catch(err => {
		console.log("error in save locations function", err);
	});
}

const save_location = (req, res) => {
	const idUser = req.body.idUser;
	const latitude = req.body.latitude;
	const longitude = req.body.longitude;

	SavedLocation.findOne({where: {
		idUser: idUser,
		longitude: longitude,
		latitude: latitude
	}})
	.then(foundLocation => {
		if (foundLocation) {
			// found a location, increment num_times
			foundLocation.increment('num_times')
			.then(newLocation => {
				if (newLocation) {
					return res.status(200).json({message: "location updated"});
				} else {
					return res.status(400).json({message: "failed to update location"});
				}
			})
			.catch(err => {
				console.log("error in save location function (update)", err);
			});
		}
		else {
			// didnt find a location, create new location
			SavedLocation.create({
				idUser: idUser,
				latitude: latitude,
				longitude: longitude,
				num_times: 1
			})
			.then(newLocation => {
				if (newLocation) {
					return res.status(200).json({message: "location saved"});
				} else {
					return res.status(400).json({message: "failed to save location"});
				}
			})
			.catch(err => {
				console.log("error in save location function", err);
			});
		}
	})
};

const remove_saved_location = (req, res) => {
	const idUser = req.body.idUser;
	const latitude = req.body.latitude;
	const longitude = req.body.longitude;

	SavedLocation.destroy({
		where: {
			idUser: idUser,
			latitude: latitude,
			longitude: longitude,
		}
	})
	.then(deletedSaveLocation => {
		if (deletedSaveLocation === 1) {
			res.status(200).json({message: "deleted successfully"});
		} else {
			res.status(404).json({message: "failed to delete location"});
		}
	})
	.catch(err => {
		console.log("error in deactivate function", err);
	});
}

module.exports = { saved_locations, save_location, remove_saved_location };
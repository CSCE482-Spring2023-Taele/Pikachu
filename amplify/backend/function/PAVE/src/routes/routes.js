const express = require("express");
const router = express.Router();

const { get_mapbox_token } = require("../controllers/mapbox.js")
const { login, isAuth, deactivate, googleOAuth } = require("../controllers/auth.js")
const { profile, edit_profile } = require("../controllers/profile.js");
const { saved_locations, save_location, remove_saved_location } = require("../controllers/save_location.js");
const { all_obstructions, obstructions, report, remove_report } = require("../controllers/report.js");

router.post("/login", login)

router.get("/deactivate", isAuth, deactivate);

router.get("/delete-save-location", isAuth, )

router.get("/get-mapbox-token", isAuth, get_mapbox_token);

router.get("/profile", isAuth, profile);

router.post("/edit-profile", isAuth, edit_profile);

router.get("/saved-locations", isAuth, saved_locations);

router.post("/save-location", isAuth, save_location);

router.post("/remove-saved-location", isAuth, remove_saved_location);

router.get("/all-obstructions", isAuth, all_obstructions)

router.post("/obstructions", isAuth, obstructions);

router.post("/report", isAuth, report);

router.post("/remove-report", isAuth, remove_report);

router.get("/", (req, res) => {
	res.status(404).json({message: "hello world"});
})

module.exports = router;
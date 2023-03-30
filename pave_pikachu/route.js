import buffer from "@turf/buffer";
import { point } from "@turf/helpers";

const GetRoute = async (startLat, startLong, 
						endLat, endLong, token) => {
	

	let reqHeader = new Headers();
	reqHeader.append("Authorization", "Bearer " + token);
	reqHeader.append('Content-Type', 'application/json');
	
	let options = {
		method: 'GET', headers: reqHeader
	};
	
	let polygons = [];
	const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev/all-obstructions";
	let resData = await fetch(url, options)
		.then(response => {
			console.log("url", url);
			let result = response.json();
			return result;
		})
		.then(async (promise) => {
			promise.map(obstruction => {
				const lat = parseFloat(obstruction.latitude);
				const long = parseFloat(obstruction.longitude);
				const p = point([lat, long]);
				const buffered = buffer(p, 50, {units: 'feet'});

				polygons.push(buffered.geometry.coordinates);
			});
			return promise;
		})
		.catch(function(err) {
			console.log("error1!!!!!", err);
		});
	
	
	reqHeader.delete("Authorization");
	reqHeader.append('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
	reqHeader.append("Authorization", "5b3ce3597851110001cf6248f834231758eb4b809ded56df20155e98");
	data = {
		coordinates: [[parseFloat(startLat),parseFloat(startLong)],[parseFloat(endLat),parseFloat(endLong)]],
		options: {
			avoid_polygons: {
				type: "MultiPolygon",
				coordinates: polygons
			}
		}
	};

	options = {
		method: 'POST', headers: reqHeader, body: JSON.stringify(data)
	};

	const base = "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";
	resData = await fetch(base, options)
		.then(response => {
			console.log("url", base);
			let result = response.json();
			// console.log(result);
			return result;
		})
		.then(async (promise) => {
			return promise;
		})
		.catch(function(err) {
			console.log("error2!!!!!", err);
		});
	return resData;
}

export default GetRoute;
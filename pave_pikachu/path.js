import buffer from "@turf/buffer";
import { point } from "@turf/helpers";
import fetch from "node-fetch";

const GetObstructions = async (token) => {
	const reqHeader = new fetch.Headers();
	reqHeader.append("Authorization", "Bearer " + token);
	reqHeader.append('Content-Type', 'application/json');
	
	const options = {
		method: 'GET', headers: reqHeader
	};
	
	let polygons = [];
	const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev/all-obstructions";
	const resData = await fetch(url, options)
		.then(response => {
			console.log("url", url);
			const result = response.json();
			return result;
		})
		.then(async (promise) => {
			promise.map(obstruction => {
				const lat = parseFloat(obstruction.latitude);
				const long = parseFloat(obstruction.longitude);
				const p = point([lat, long]);
				const buffered = buffer(p, 20, {units: 'feet'});

				polygons.push(buffered.geometry.coordinates);
			});
			return {
				data: promise,
				polygons: polygons
			};
		})
		.catch(function(err) {
			console.log("error1!!!!!", err);
		});

	return resData;
}

const GetPath = async (startLat, startLong, 
						endLat, endLong, polygons) => {
	
	const reqHeader = new fetch.Headers();
	reqHeader.append('Content-Type', 'application/json');
	reqHeader.append('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
	reqHeader.append("Authorization", "5b3ce3597851110001cf6248f834231758eb4b809ded56df20155e98");

	const data = {
		coordinates: [[parseFloat(startLat),parseFloat(startLong)],[parseFloat(endLat),parseFloat(endLong)]],
		options: {
			avoid_polygons: {
				type: "MultiPolygon",
				coordinates: polygons
			}
		}
	};

	const options = {
		method: 'POST', headers: reqHeader, body: JSON.stringify(data)
	};

	const base = "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";
	const resData = await fetch(base, options)
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

export {GetObstructions, GetPath};
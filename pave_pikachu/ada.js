const AccessibilityEntrances = async (resultOffset, resultRecordCount) => {

	let reqHeader = new Headers();
	reqHeader.append('Content-Type', 'application/json');

	let options = {
		method: 'GET', headers: reqHeader
	};

	const searchParams = new URLSearchParams({
		where: "1=1",
		returnGeometry: true,
		outSR: 4326,
		f: "json",
		resultOffset: resultOffset,
		resultRecordCount: resultRecordCount,
	});

	const base = "https://gis.tamu.edu/arcgis/rest/services/FCOR/ADA_120717/MapServer/0/query?";
	let resData = await fetch(base + searchParams, options)
		.then(response => {
			console.log("url", base + searchParams);
			let result = response.json();
			// console.log(result);
			return result;
		})
		.then(async (promise) => {
			// console.log(promise);
			return promise;
		})
		.catch(function(err) {
			console.log("error!!!!!", err);
		});
	return resData;
}

export default AccessibilityEntrances;
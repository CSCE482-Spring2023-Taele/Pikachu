const fetch = require("node-fetch");

// changed secret key
const MAPBOX_ACCESS_TOKEN = 'secret key'

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}


async function get_mapbox_token (req, res) {
    let reqHeader = new fetch.Headers();
    reqHeader.append('Content-Type', 'application/json');
    
	let date = new Date(); 
    console.log(date)
    const expireDate = addMinutes(date, 59)
    console.log(expireDate)
	const data = {
		"expires" : expireDate, //will expire in one hour
		"scopes"  : ["styles:read"] //styles:read needed to initialize map
	}
	let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };

	const url = 'https://api.mapbox.com/tokens/v2/cesgar124?access_token='+MAPBOX_ACCESS_TOKEN;

	fetch(url, initObject)
        .then(response => {
            let result = response.json();
            return result
        })
        .then(async(promise) => {
            return res.status(200).json({message: promise});
        })
        .catch(function(err) {
            console.log(err, "error in mapbox token function")
        });
}

module.exports = {
	get_mapbox_token
}
const dummy = (int) => {
    return int + 1;
}

import fetch from "node-fetch";

const attemptLogin = async (userinfo) => {
    const data = {
        email: userinfo.user.email,
        first_name: userinfo.user.givenName,
        last_name: userinfo.user.familyName
    } 
    let reqHeader = new Headers();
    reqHeader.append("Authorization", "Bearer " + userinfo.idToken);
    reqHeader.append('Content-Type', 'application/json');
    
    let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };
    
    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";

    let resData = await fetch(url + "/login", initObject)
        .then(response => {
            let result = response.json();
            return result;
        })
        .then(async(promise) => {
            
            return promise;
        })
        .catch(function(err) {
            console.log("ERROR", err);
        });
    return resData;
}

const attemptRegister = async (email, firstName, lastName) => {
    const data = {
        email: email,
        first_name: firstName,
        last_name: lastName,
    } 

    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');

    let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };

    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";

    let resData = await fetch(url + "/signup", initObject)
        .then(response => {
            let result = response.json();
            return result;
        })
        .then(async(promise) => {
            return promise;
        })
        .catch(function(err) {
            console.log("ERROR", err);
        });
    return resData;
}

const attemptReport = async (latitude, longitude, type, description, token) => {
    const data = {
        latitude: latitude,
        longitude: longitude,
        type: type,
        description: description
    } 

    let reqHeader = new fetch.Headers();
    reqHeader.append('Content-Type', 'application/json');
    reqHeader.append("Authorization", "Bearer " + token);

    let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };
    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";
    let resData = await fetch(url + "/report", initObject)
        .then(response => {
            let result = response.json();
            return result;
        })
        .then(async(promise) => {
            return promise;
        })
        .catch(function(err) {
            console.log("ERROR", err);
        });
    return resData;
}

const geocodingAPI = async (search, mapboxToken, boundingBox) => {
    const address = encodeURIComponent(search.trim())

    const bb = "-180%2C-90%2C180%2C90" //example
    //const geoURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + ".json?country=us&bbox="+ bb +"&language=en&access_token="+mapboxToken;
    const geoURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + ".json?country=us&language=en&access_token="+mapboxToken;
    console.log(geoURL)
    const response = await fetch(geoURL);
    
    let resData = await response.text()
    resData = JSON.parse(resData)
   
    return resData;
}

const reverseGeocodingAPI = async(longitude, latitude, mapboxToken) => {
    const geoURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+longitude+","+latitude+".json?country=us&limit=1&access_token="+mapboxToken;
    // console.log(geoURL)
    const response = await fetch(geoURL);
    
    let resData = await response.text()
    resData = JSON.parse(resData)
   
    return resData;
}

const saveLocation = async(coordinates, token, mapboxToken) => {
    const reverse = await reverseGeocodingAPI(coordinates[0], coordinates[1], mapboxToken)
    const features = reverse.features[0]
    const longitude = features.geometry.coordinates[0]
    const latitude = features.geometry.coordinates[1]
    console.log("HEEHHEEHEHEHHEEHEHEHEHEHEHHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHE")
    console.log(mapboxToken, longitude, latitude)

    const data = {
        longitude: longitude,
        latitude: latitude,
    };

    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');
    reqHeader.append("Authorization", "Bearer " + token);

    let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };

    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";
    let resData = await fetch(url + "/save-location", initObject)
        .then(response => {
            let result = response.json();
            return result;
        })
        .then(async(promise) => {
            return promise;
        })
        .catch(function(err) {
            console.log("ERROR", err);
        });
    
}

const getSavedLocations = async(token) => {
    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');
    reqHeader.append("Authorization", "Bearer " + token);

    let initObject = {
        method: 'GET', headers: reqHeader
    };

    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";
    let response = await fetch(url + "/saved-locations", initObject)
        // .then(response => {
        //     let result = response.json();
        //     console.log("here2");
        //     return result;
        // })
        // .then(async(promise) => {
        //     console.log("here3");
        //     return promise;
        // })
        // .catch(function(err) {
        //     console.log("ERROR", err);
        // });
    let resData = await response.text()
    resData = JSON.parse(resData)
    return resData
}

const deleteSavedLocation = async(long, lat, token) => {
    const data = {
        longitude: long,
        latitude: lat,
    };

    console.log("lat: " + lat);
    console.log("long: " + long);

    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');
    reqHeader.append("Authorization", "Bearer " + token);

    let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };

    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";
    let resData = await fetch(url + "/remove-saved-location", initObject)
        .then(response => {
            let result = response.json();
            console.log("delete here");
            return result;
        })
        .then(async(promise) => {
            console.log("delete here2");
            return promise;
        })
        .catch(function(err) {
            console.log("ERROR", err);
        });   
}

const deleteAccount = async(token) => {
    console.log("deleting...")

    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');
    reqHeader.append("Authorization", "Bearer " + token);

    let initObject = {
        method: 'GET', headers: reqHeader
    };

    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";
    let response = await fetch(url + "/deactivate", initObject)

    let resData = await response.text()
    resData = JSON.parse(resData)

    console.log(resData);
    return resData
}



export {
    attemptLogin, 
    attemptRegister, 
    attemptReport, 
    geocodingAPI, 
    reverseGeocodingAPI, 
    saveLocation, 
    getSavedLocations, 
    deleteSavedLocation, 
    deleteAccount,
    dummy};


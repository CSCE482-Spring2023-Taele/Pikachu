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
            console.log(promise)
            return promise;
        })
        .catch(function(err) {
            console.log("ERROR", err);
        });
        console.log(resData)
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

    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');
    reqHeader.append("Authorization", "Bearer " + token);

    let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };
    console.log("lat:" + latitude);
    console.log("long: " + longitude);
    console.log("token: " + token);

    const url = "https://b03x6lkzlb.execute-api.us-east-1.amazonaws.com/dev";
    let resData = await fetch(url + "/report", initObject)
        .then(response => {
            let result = response.json();
            console.log("here2");
            return result;
        })
        .then(async(promise) => {
            console.log("here3");
            return promise;
        })
        .catch(function(err) {
            console.log("ERROR", err);
        });
    return resData;
}

export {attemptLogin, attemptRegister, attemptReport};


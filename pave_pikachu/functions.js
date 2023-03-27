const attemptLogin = async (email) => {
    const data = {
        email: email,
    } 
    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');

    let initObject = {
        method: 'POST', headers: reqHeader, body: JSON.stringify(data)
    };
    // console.log("2")
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

export {attemptLogin, attemptRegister};



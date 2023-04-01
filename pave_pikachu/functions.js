const attemptLogin = async (user) => {
    const data = {
        email: user.email,
        first_name: user.givenName,
        last_name: user.familyName
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

export {attemptLogin};



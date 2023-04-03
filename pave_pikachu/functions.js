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
    return resData;
}

export {attemptLogin};



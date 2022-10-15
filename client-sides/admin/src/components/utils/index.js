import moment from "moment";

export let fetchData = (endpoint, dataUpdater) => {
    fetch(endpoint)
        .then(resp => resp.json())
        .catch(err => console.error("response error", err))
        .then(data => dataUpdater(data))
        .catch(err => new Error("error caught", err))
}

export let deleteData = (endpoint, data, handleDoneDelete) => {
    fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => {
        console.log("data deletion is ongoing")
        if(res.status >= 200 && res.status <= 299) {
            handleDoneDelete()
        } else {
            res.json({success: false, msg: "could not be deleted"})
        }
    })
    .catch(err => console.error(err))
}

export let sendDataToServer = (dataObj, errorUpdater, endpoint) => {
    fetch((endpoint || "http://localhost:3000/blog/create"), {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
            console.log("data is sent to server side", resp)
            errorUpdater([]);
        } else {
            let data = resp.json();
            data
                .then(respData => {
                    console.log(respData);
                    errorUpdater(respData);
                })
                .catch(err => console.error('error occured', err))
        }
    })
        .catch(err => console.error('error occured', err))
}

export let updateThisBlogPost = blogPostObj => {
    // console.log(blogPostObj, "<<>>")
    fetch("http://localhost:3000/blog/update", {
        method: "put",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(blogPostObj)
    }).then(() => console.log("blog data is sent to server to update"))
        .catch(err => console.error('error occured', err))
}

export let beginUserAuthenticationProcess = (blogPostObj, errorUpdater, endpoint, handleAuth) => {
    fetch((endpoint), {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(blogPostObj)
    }).then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
            console.log("data is sent to server side", resp)

            let response = resp.json();
            response.then(data => {
                // console.log(data, "<<data>>");
                setLocalStorageItems(data);
                // handleWhichForm("logout")
                handleAuth()
            })
                .catch(err => console.error(err))

            errorUpdater([]);
        } else {
            let data = resp.json();
            data
                .then(respData => {
                    // console.log(respData);
                    errorUpdater(respData);
                    // if (respData.success === false) {
                    //     handleWhichForm("register")
                    // }
                })
                .catch(err => console.error('error occured', err))
        }
    })
        .catch(err => console.error('error occured', err))
}

let setLocalStorageItems = (authObject) => {
    // let expires = moment().add(authObject.expiresIn)
    let expires = moment().add(1, "days")

    localStorage.setItem("token", authObject.token);
    // localStorage.setItem("expires", expires);
    localStorage.setItem("expires", JSON.stringify(expires.valueOf())); // sets time in millis
}

export const getExpiration = () => {
    const expiration = localStorage.getItem("expires");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt)
}

export const isLoggedIn = () => {
    return moment().isBefore(getExpiration());
}

export const isLoggedOut = () => !isLoggedIn()

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires");
}
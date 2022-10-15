let emailEl = document.querySelector("#email");
let nameEl = document.querySelector("#name");
let bodyEl = document.querySelector("#body");
let blogDiv = document.querySelector(".bp-wrapper");
let errosDiv = document.querySelector(".errors");

let showCommentFormView = () => {
    // let commentsDiv = document.querySelector(".comments");
    let commentForm = document.querySelector(".comment-form");
    commentForm.style.display = 'block';
}

let handleUserCommentSubmit = () => {
    let email = emailEl.value;
    let name = nameEl.value;
    let body = bodyEl.value;
    let blogPost = document.querySelector(".bp-wrapper").id

    let data = {
        email,
        name,
        body,
        blogPost
    }

    if(email && name && body) {
        postDataToServer(data)
    } else {
        alert("provide all required fields")
    }
}

let renderErrorMarkup = (errors) => {
    let errosDiv = document.querySelector(".errors");
    errosDiv.append(renderErrors(errors))
}

let renderErrors = (errors) => {
    let ulDiv = document.createElement("ul");
    errors.forEach(error => {
        let liDiv = document.createElement("li");
        liDiv.textContent = error.msg;
        ulDiv.append(liDiv);
    })
    return ulDiv;
}

let removeValues = () => {
    clearInputValues()
    clearPreviousErrorMessages();
    announceSuccessfullCommentPost();
}

let clearPreviousErrorMessages = () => {
    errosDiv.childNodes.forEach(node => node.remove())
}

let clearInputValues = () => {
    emailEl.value = null;
    nameEl.value = null;
    bodyEl.value = null;
}

let announceSuccessfullCommentPost = () => {
    let h2El = document.createElement("h2");
    h2El.textContent = "Comment Posted"
    errosDiv.append(h2El)
}

let postDataToServer = (data) => {
    fetch(("http://localhost:3000/comment/create"), {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
            // console.log("data is sent to server side", resp)
            removeValues();
            fetchCommentsForPost(data.blogPost)
        } else {
            let data = resp.json();
            data
                .then(respData => {
                    renderErrorMarkup(respData.errors)
                })
                .catch(err => console.error('error occured', err))
        }
    })
        .catch(err => console.error('error occured', err))
}
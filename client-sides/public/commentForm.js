let emailEl = document.querySelector("#email");
let nameEl = document.querySelector("#name");
let bodyEl = document.querySelector("#body");
let blogDiv = document.querySelector(".bp-wrapper");
let errosDiv = document.querySelector(".errors");

let showCommentFormView = () => {
    let commentsDiv = document.querySelector(".comments");
    // commentsDiv.classList.remove("comments");
    // commentsDiv.classList.add("show-comments");
}

let handleUserCommentSubmit = () => {
    // event.preventDefault()
    let email = emailEl.value;
    let name = nameEl.value;
    let body = bodyEl.value;
    // let blogPost = blogDiv.id;
    let blogPost = document.querySelector(".bp-wrapper").id

    // console.log(name.value, comment.value, "<><>", postDiv.id);
    let data = {
        email,
        name,
        body,
        blogPost
    }

    console.log(data, "data")

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

// let renderErrors = (errors) => {
//     let domStr = `<ul>
//         ${errors.forEach(err => <li>{err.msg}</li>)}
//     </ul>`
//     document.createRange().createContextualFragment(domStr).firstChild
// }

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
            console.log("data is sent to server side", resp)
            removeValues();
            fetchCommentsForPost(data.blogPost)
        } else {
            let data = resp.json();
            data
                .then(respData => {
                    console.log(respData, "respData!!")
                    renderErrorMarkup(respData.errors)
                })
                .catch(err => console.error('error occured', err))
        }
    })
        .catch(err => console.error('error occured', err))
}
let acDiv = document.querySelector(".all-comments");

let removeComments = () => {
    acDiv.childNodes.forEach(node => node.remove());
}

let showBlogPostComments = () => {
    let blogDiv = document.querySelector(".bp-wrapper");
    fetchCommentsForPost(blogDiv.id)
}

let fetchCommentsForPost = (blogId) => {
    fetch(`http://localhost:3000/comment/${blogId}/all-comments`)
    .then(res =>res.json())
    .catch(err => console.error(err, 'response error'))
    .then(data => {
        removeComments();
        commenceRenderingPostComments(data)
    })
    .catch(err => console.error('error occured', err))
}

let commenceRenderingPostComments = data => {
    if(data.data.length) {
        let acDiv = document.querySelector(".all-comments");
        data.data.forEach(item => {
            acDiv.append(commentMarkup(item))
        })
    }
}

let commentMarkup = (commentData) => {
    let domStr = `<div class="comment-wrapper">
        <div class="name">Name: ${commentData.name}</div>
        <div class="body">Body: ${commentData.body}</div>
        <div class="posted">Posted: ${moment(commentData.posted).format("YYYY-MM-DD")} <span>${moment(commentData.posted).from(moment())}</span></div>
    </div>`

    return document.createRange().createContextualFragment(domStr).firstChild
}
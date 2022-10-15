let blogsData = []
let postsContainer = document.querySelector(".blogs")
let CHUNK = 1;
let CURRENT = 0;

let fetchAllBlogPosts = () => {
    fetch("http://localhost:3000/blog/all-posts/")
        .then(resp => resp.json())
        .catch(err => console.error('Caught error: ', err))
        .then(data => {
            // filtering only published blogs
            blogsData = data.posts.filter(item => item.published);
            renderDataByChunk(blogsData, CHUNK, CURRENT);

            // increasing current value with adding chunk to it
            CURRENT = CURRENT + CHUNK;

            // show comments when there is blog posts available
            if (blogsData.length) {
                showCommentFormView()
            }
        })
        .catch(err => new Error("error occured", err))
}

let handlePrevious = () => {
    if (CURRENT > 0) {
        let temp = CURRENT - CHUNK
        cleanExistingBlogPosts();

        renderDataByChunk(blogsData, CURRENT, temp)
        CURRENT = temp;
    }

    // Keeping CURRENT at 1 as a starting point for next cycle operations
    if (CURRENT == 0) {
        CURRENT = CHUNK
    }
}

let handleNext = () => {
    if (CURRENT <= blogsData.length - 1) {
        let temp = CURRENT + CHUNK
        cleanExistingBlogPosts();

        renderDataByChunk(blogsData, temp, CURRENT)
        CURRENT = temp;
    }

    // keeping CURRENT at previous point so that "previous" cycle doesnt have to wait a click
    if (CURRENT == blogsData.length) {
        CURRENT = CURRENT - CHUNK
    }
}

let cleanExistingBlogPosts = () => {
    postsContainer.childNodes.forEach(node => {
        node.remove()
    })
}

let renderDataByChunk = (data, limit, starting) => {
    data.forEach((postObj, idx) => {
        if (idx >= starting && idx < limit) {
            postMarkup(postObj, postsContainer)
            // show comment form markup
            showCommentFormView()
            // rendering comments if any
            showBlogPostComments()
        }
    })
}

let postMarkup = (postObj, container) => {
    let { _id, title, body, authorName, posted } = { ...postObj }

    let postWrapper = document.createElement("div");
    postWrapper.id = _id;
    postWrapper.classList.add("bp-wrapper");
    let postTitle = createMarkup(title, 'h2', "post-title");
    let postBody = createMarkup(body, "p", "post-body");

    let infoWrapper = document.createElement("div");
    let postAuthor = createMarkup(authorName, "span", "post-author");
    let postDate = createMarkup(posted, "span", "post-date")
    infoWrapper.classList.add("info-wrapper");
    infoWrapper.append(postAuthor, postDate);

    postWrapper.append(postTitle, postBody, infoWrapper)
    container.appendChild(postWrapper);
}

let createMarkup = (data, type, className) => {
    let element = document.createElement(type);
    if (className === "post-date") {
        let dateNow = new Date(data).toISOString();
        element.textContent = moment(dateNow).fromNow();
    } else {
        element.textContent = data || className;
    }
    element.classList.add(className);
    return element
}

/**
 * Event Listeners
 */

// next button event listener
let nextBtn = document.querySelector(".next-btn");
nextBtn.addEventListener("click", handleNext)

// previous button event listener
let prevBtn = document.querySelector(".prev-btn");
prevBtn.addEventListener("click", handlePrevious)

// begin fetching all posts
fetchAllBlogPosts();
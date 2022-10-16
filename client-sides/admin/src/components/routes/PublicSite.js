import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { RenderErrors } from '../RenderErrors';
import { fetchData, sendCommentDataToServer } from '../utils'

function PublicSite() {
    let [blogs, setBlogs] = useState([])
    let [currentBlogIdx, setCurrentBlogIdx] = useState(0);
    let [chunk, setChunk] = useState(1);

    let handleblogs = data => setBlogs(data.posts.filter(item => item.published));

    useEffect(() => {
        setChunk(1);
        fetchData("http://localhost:3000/blog/all-posts/", handleblogs)
    }, [])

    return (
        <div class="container">
            <BlogsList blogs={blogs} currentBlogIdx={currentBlogIdx} />
            <ButtonsWrapper blogs={blogs} current={currentBlogIdx} setCurrentBlogIdx={setCurrentBlogIdx} chunk={chunk} />
            <CommentsWrapper blogs={blogs} current={currentBlogIdx} />
        </div>
    )
}

let BlogsList = ({ blogs, currentBlogIdx }) => {
    let renderBlogs = () => blogs?.map((blog, idx) => idx === currentBlogIdx ? <RenderBlog key={blog._id} blog={blog} /> : null)

    return (
        <div class="blogs">
            {renderBlogs()}
        </div>
    )
}

let RenderBlog = ({ blog }) => {
    let { _id, title, body, authorName, posted } = { ...blog }
    return (
        <div id={_id} class="bp-wrapper">
            <h2 class="post-title">{title}</h2>
            <p class="post-body">{body}</p>
            <div class="info-wrapper">
                <span class="post-author">{authorName}</span>
                <span class="post-date">{moment(posted).format("YYYY-MM-DD, h A")}</span>
            </div>
        </div>
    )
}

let ButtonsWrapper = ({ blogs, current, setCurrentBlogIdx, chunk }) => {
    let handlePrevious = () => {
        if (current > 0) {
            let temp = current - chunk
            setCurrentBlogIdx(temp)
        }
    }

    let handleNext = () => {
        if (current < blogs.length - 1) {
            let temp = current + chunk
            setCurrentBlogIdx(temp)
        }
    }

    return (
        <div class="btns-wrapper">
            <div class="prev-btn" onClick={handlePrevious}>
                <i class="fa-solid fa-left-long"></i>
                <span>Prev</span>
            </div>
            <div class="next-btn" onClick={handleNext}>
                <span>Next</span>
                <i class="fa-solid fa-right-long"></i>
            </div>
        </div>
    )
}

let CommentsWrapper = ({ blogs, current }) => {
    let [reFetch, setRefetch] = useState(false);
    let [errors, setErrors] = useState([])
    
    let handleErrors = data => setErrors(data);
    
    return (
        <div class="comments">
            {errors.length ? <RenderErrors errors={errors} /> : null}
            <CommentForm errorUpdater={handleErrors} id={blogs[current]?._id} setRefetch={setRefetch} />
            {
                blogs?.length && <AllComments blogs={blogs} currentBlogIdx={current} reFetch={reFetch} setRefetch={setRefetch} />
            }
        </div>
    )
}

let AllComments = ({ blogs, currentBlogIdx, reFetch, setRefetch }) => {
    let [commentsData, setCommentsData] = useState([]);
    
    let handleComments = data => setCommentsData(data.data);

    useEffect(() => {
        fetchData(`http://localhost:3000/comment/${blogs[currentBlogIdx]._id}/all-comments`, handleComments)
        reFetch && setRefetch(false)
    }, [currentBlogIdx, reFetch])    

    let renderComments = () => commentsData?.map(comment => <RenderComment key={comment._id} commentData={comment} />)

    return (
        <div class="all-comments">
            {renderComments()}
            <h2>{commentsData.length === 0 ? "No comment is found, be first to comment" : ""}</h2>
        </div>
    )
}

let RenderComment = ({commentData}) => {
    return (
        <div class="comment-wrapper">
            <div class="name">Name: {commentData.name}</div>
            <div class="body">Body: {commentData.body}</div>
            <div class="posted">
                <span>Posted: {moment(commentData.posted).format("YYYY-MM-DD")}</span>
                <span>{moment(commentData.posted).from(moment())}</span></div>
        </div>
    )
}

let CommentForm = ({errorUpdater, id, setRefetch}) => {
    let [formData, setFormData] = useState({});

    let handleFormDataChange = (event, element) => {
        setFormData(prev => ({...prev, [element]: event.target.value}))
    }    

    let handleSubmit = (event) => {
        formData.blogPost = id;
        event.preventDefault()
        sendCommentDataToServer(event, formData, errorUpdater, setRefetch)
    }

    return (
        <form class="comment-form" action="" method="post" onSubmit={handleSubmit}>
            <legend>Feel like posting a comment</legend>
            <fieldset>
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" required placeholder="your name goes here" onChange={(e) => handleFormDataChange(e, "name")} />
            </fieldset>
            <fieldset>
                <label htmlFor="email">Your Email (* will not be shared publicly )</label>
                <input type="email" id="email" name="email" required placeholder="your email goes here" onChange={(e) => handleFormDataChange(e, "email")} />
            </fieldset>
            <fieldset>
                <label htmlFor="body">Your Comment</label>
                <textarea name="body" id="body" rows="4" required placeholder="your comment goes here" onChange={(e) => handleFormDataChange(e, "body")}></textarea>
            </fieldset>
            <button type="submit">Post Comment</button>
        </form>
    )
}

export default PublicSite
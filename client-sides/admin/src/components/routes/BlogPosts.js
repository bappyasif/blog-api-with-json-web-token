import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCalendarCheck, faClipboardUser} from "@fortawesome/free-solid-svg-icons"
import { fetchData, updateThisBlogPost } from '../utils';

function BlogPosts() {
    let [blogPosts, setBlogPosts] = useState([]);

    let handleBlogPosts = data => setBlogPosts(data.posts)

    useEffect(() => {
        fetchData("http://localhost:3000/blog/all-posts", handleBlogPosts)
    }, [])

    return (
        <div className='bp-container'>
            <h1>All Blog Posts Both Published And Unpublished</h1>
            {
                blogPosts
                ?
                <RenderAllBlogPosts blogPosts={blogPosts} />
                :
                null
            }
        </div>
    )
}

let RenderAllBlogPosts = ({blogPosts}) => {
    let renderPosts = () => blogPosts?.map(postItem => <RenderThisBlogPost key={postItem._id} blogPost={postItem} />)
    return (
        <ol className='abp-wrapper'>
            {renderPosts()}
        </ol>
    )
}

let RenderThisBlogPost = ({blogPost}) => {
    let {_id, title, body, authorName, posted, published} = {...blogPost}

    let [togglePublish, setTogglePublish] = useState()

    useEffect(() => setTogglePublish(published), [])

    let handleClick = () => {
        updateThisBlogPost(blogPost)
        setTogglePublish(!togglePublish);
    }

    return (
        <li className='blog-post'>
            <Link to={`/blogs/${_id}`}><h2 className='post-title'>{title}</h2></Link>
            {/* <p className='post-body'>{body}</p> */}
            <p className='post-body' dangerouslySetInnerHTML={{__html: body}}></p>
            <p className='info-wrapper'>
                <span className='author-name'>
                    <FontAwesomeIcon icon={faClipboardUser} className="fres" />
                    <span>{authorName}</span>
                </span>
                <span className='posted'>
                    <FontAwesomeIcon icon={faCalendarCheck} className="fres" />
                    <span>{moment(posted).format("YYYY/MM/DD -- h:mm a")}</span>
                </span>
                <button onClick={handleClick}>{togglePublish ? "Unpublish" : "Publish"}</button>
            </p>
        </li>
    )
}

export default BlogPosts
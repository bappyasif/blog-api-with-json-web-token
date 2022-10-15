import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCalendarCheck, faClipboardUser, faStopwatch} from "@fortawesome/free-solid-svg-icons"
import { fetchData } from '../utils'

function BlogDetails() {
  let [blogData, setBlogData] = useState([]);
  let [comments, setComments] = useState([]);
  
  const param = useParams();
  
  const commentsEndpoint = `http://localhost:3000/comment/${param.blogId}/all-comments`;
  const blogPostEndpoint = `http://localhost:3000/blog/posts/${param.blogId}`;

  let handleComments = data => setComments(data.data);

  let handleBlogPost = data => setBlogData(data.blogData[0])

  useEffect(() => {
    fetchData(commentsEndpoint, handleComments)
    fetchData(blogPostEndpoint, handleBlogPost)
  }, [])

  let renderComments = () => comments?.map(comment => <RenderComment key={comment._id} commentData={comment} />)

  return (
    <div className='bd-wrapper'>
      <div className='blog-post'>
        <h2 className='post-title'>{blogData.title}</h2>
        <p className='post-body'>{blogData.body}</p>
        <p className='info-wrapper'>
          <span className='author-name'>
            <span><FontAwesomeIcon icon={faClipboardUser} className="fres" /></span>
            <span>{blogData.authorName}</span>
          </span>
          <span className='posted'>
            <span className='format'><FontAwesomeIcon icon={faCalendarCheck} className="fres" /><span>{moment(blogData.posted).format("YYYY/MM/DD")}</span></span>
            <span className='relative'><FontAwesomeIcon icon={faStopwatch} className="fres" /><span>{moment(blogData.posted).from(moment())}</span></span>
          </span>
        </p>
      </div>
      <h1>All Comments</h1>
      <ol>
        {comments.length ? renderComments() : null}
      </ol>
    </div>
  )
}

let RenderComment = ({ commentData }) => {

  return (
    <li className="comment-wrapper">
      <div className='item-div'><span>Email: </span> <span>{commentData.email}</span></div>
      <div className='item-div'>Name: {commentData.name}</div>
      <div className='item-div'>Body: {commentData.body}</div>
      <div className='item-div'>Posted: {moment(commentData.posted).format("YYYY / MM / DD")}</div>
      <div className='btns'>
        <Link className='nav-link' to={`/comments/${commentData._id}`}>Edit</Link>
        <Link className='nav-link' to={`/comments/${commentData._id}/delete`}>Delete</Link>
      </div>
    </li>
  )
}

export default BlogDetails
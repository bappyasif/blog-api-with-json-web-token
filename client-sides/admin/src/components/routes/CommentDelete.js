import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { deleteData, fetchData } from '../utils';

function CommentDelete() {
    let [commentData, setCommentData] = useState([]);
    let [doneDelete, setDoneDelete] = useState(false);
    let params = useParams()

    let handleComment = data => setCommentData(data.data);

    let handleDoneDelete = () => setDoneDelete(true);

    useEffect(() => {
        const url = `http://localhost:3000/comment/blog/${params.commentId}`;
        fetchData(url, handleComment)
    }, [])

    let handleSubmit = event => {
        event.preventDefault();
        const url = `http://localhost:3000/comment/blog/${params.commentId}`;
        deleteData(url, {commentId: commentData._id}, handleDoneDelete)
    }

  return (
    <div>
        <h1>Comment Delete</h1>
        <h2>Are you sure you want to delete this comment?</h2>
        {doneDelete ? <Navigate to={`/blogs/${commentData.blogPost}`} /> : null}
        <form method='post' action='' onSubmit={handleSubmit}>
            <input hidden name='commentId' />
            {/* <button><Link to={`/blogs/${commentData.blogPost}`}>Delete</Link></button> */}
            <button type='submit'>Delete</button>
            <Link className='nav-link' to={`/blogs/${commentData.blogPost}`}>Cancel</Link>
        </form>
    </div>
  )
}

export default CommentDelete
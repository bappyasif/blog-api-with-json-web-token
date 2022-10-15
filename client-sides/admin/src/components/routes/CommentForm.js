import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { RenderErrors } from '../RenderErrors';
import { fetchData, sendDataToServer } from '../utils';

function CommentForm({ }) {
    let [commentData, setCommentData] = useState([]);
    let [formData, setFormData] = useState({});
    let [donePosting, setDonePosting] = useState(false);
    let [errorResponse, setErrorResponse] = useState([]);
    let params = useParams();

    let handleFormData = (elm, evt) => {
        if (elm === "posted") {
            setFormData(prev => ({ ...prev, [elm]: evt.target.value }))
        } else {
            setFormData(prev => ({ ...prev, [elm]: evt.target.value }))
        }
    }

    let handleComment = data => setCommentData(data.data)

    // initial comment data load from server
    useEffect(() => {
        const url = `http://localhost:3000/comment/blog/${params.commentId}`;
        fetchData(url, handleComment)
    }, [])

    // when comment data is available then add it to form data so that it can be used as a default value to existing fields
    // also adding blog post reference for redirecting purposes in admin site
    useEffect(() => {
        if (commentData._id) {
            let { _id, email, name, body, posted, blogPost } = { ...commentData }

            setFormData(prev => ({ ...prev, "email": email }))
            setFormData(prev => ({ ...prev, "name": name }))
            setFormData(prev => ({ ...prev, "body": body }))
            setFormData(prev => ({ ...prev, "posted": posted }))
            setFormData(prev => ({ ...prev, "_id": _id }))
            setFormData(prev => ({ ...prev, "blogPost": blogPost }))
        }
    }, [commentData])

    let handleErrorResponse = data => {
        // upon successful data submit to server we're resetting form value to null, 
        //  and setting donePosting state to true for navigating bac to blogs route
        if (data.length === 0) {
          setFormData({})
          setDonePosting(true)
        }
        setErrorResponse(data);
      }
    
    // submiting data to server for updating
    let handleFormDataSubmit = event => {
        event.preventDefault();
        const endpoint = `http://localhost:3000/comment/blog/${commentData._id}`
        sendDataToServer(formData, handleErrorResponse, endpoint);
    }

    // console.log(commentData, "data", formData, params)
    // console.log(commentData, "data")

    return (
        <div className='cu-wrapper'>
            <h1>User Comment</h1>
            {errorResponse?.errors ? <RenderErrors errors={errorResponse.errors} /> : null}
            {donePosting ? <Navigate to="/blogs/${commentData.blogPost}" /> : null}

            <form action='' method='post' onSubmit={handleFormDataSubmit}>
                <legend>Update User Comment Form</legend>
                <fieldset>
                    <label htmlFor='email'>Email: </label>
                    <input id='email' name='email' type={'email'} defaultValue={formData.email} onChange={(e) => handleFormData("email", e)} />
                </fieldset>
                <fieldset>
                    <label htmlFor='name'>Name: </label>
                    <input id='name' name='name' type={'text'} defaultValue={formData.name} onChange={(e) => handleFormData("name", e)} />
                </fieldset>
                <fieldset>
                    <label htmlFor='body'>Body: </label>
                    <input id='body' name='body' type={'text'} defaultValue={formData.body} onChange={(e) => handleFormData("body", e)} />
                </fieldset>
                <fieldset>
                    <label htmlFor='posted'>Posted: </label>
                    <input id='posted' name='posted' type={'date'} defaultValue={moment(formData.posted).format("YYYY-MM-DD")} onChange={(e) => handleFormData("posted", e)} />
                </fieldset>
                <div className='btns'>
                    <button type='submit'>Update</button>
                    <Link className='nav-link' to={`/blogs/${commentData.blogPost}`}>Cancel</Link>
                </div>
            </form>
        </div>
    )
}

export default CommentForm
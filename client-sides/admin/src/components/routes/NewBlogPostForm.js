import React, { useEffect, useState } from 'react'
import { sendDataToServer } from '../utils';
import { Editor } from "@tinymce/tinymce-react"
import { Navigate } from 'react-router';
import { RenderErrors } from '../RenderErrors';

function NewBlogPostForm({ }) {
  let [formData, setFormData] = useState({});
  let [errorResponse, setErrorResponse] = useState([]);
  let [donePosting, setDonePosting] = useState(false);

  let handleErrorResponse = data => {
    // upon successful data submit to server we're resetting form value to null, 
    //  and setting donePosting state to true for navigating bac to blogs route
    if (data.length === 0) {
      setFormData({})
      setDonePosting(true)
    }
    setErrorResponse(data);
  }

  let handleSubmit = (event) => {
    event.preventDefault();
    sendDataToServer(formData, handleErrorResponse);
  }

  // form controls are using same change handler for avoiding almost duplication or repetitions
  let handleChange = (evt, element) => {
    if (element === "published") {
      setFormData(prev => ({ ...prev, [element]: !prev[element] }));
    } else if (element === 'body') {
      setFormData(prev => ({ ...prev, [element]: evt.target.getContent() }));
    } else {
      setFormData(prev => ({ ...prev, [element]: evt.target.value }));
    }
  }

  // making uid to be saved formData, so that when data is submited user id is accessible to server
  useEffect(() => {
    setFormData(prev => ({...prev, "uid": localStorage.getItem("uid").toString()}))
  }, [])

  return (
    <div className='form-wrapper'>
      {donePosting ? <Navigate to="/blogs" /> : null}
      {errorResponse?.errors ? <RenderErrors errors={errorResponse.errors} /> : null}
      <form method='post' action='' onSubmit={handleSubmit}>
        <legend>Create A New Blog Post</legend>
        <input type={"hidden"} name="uid" defaultValue={localStorage.getItem("uid").toString()} />
        <fieldset>
          <label htmlFor='title'>Ttile</label>
          <input id='title' type={'text'} name={'title'} onChange={(e) => handleChange(e, 'title')} placeholder={"type in blog post title here...."} required />
        </fieldset>
        <fieldset>
          <label htmlFor='body'>Body</label>
          {/* <textarea id='body' type={'text'} name={'body'} onChange={(e) => handleChange(e, 'body')} placeholder={"type in blog post title here...."} required></textarea> */}
          <Editor
            initialValue="<p>This is the initial content of the editor</p>"
            init={{
              selector: 'textarea',  // change this value according to your HTML
              height: 300,
              branding: false,
              menubar: false,
              preview_styles: false,
              plugins: 'link code',
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
            }}
            id="body"
            onChange={(e) => handleChange(e, 'body')}
          />
        </fieldset>
        <fieldset>
          <label htmlFor='author'>Author</label>
          <input id='author' type={'text'} name={'author'} onChange={(e) => handleChange(e, 'authorName')} placeholder={"author name goes here...."} required />
        </fieldset>
        <fieldset>
          <label htmlFor='posted'>Posted</label>
          <input id='posted' type={'date'} name={'posted'} onChange={(e) => handleChange(e, 'posted')} required />
        </fieldset>
        <fieldset>
          <label htmlFor='publish'>Do you want this blog post to publish now? <input id='publish' name='publish' type={"checkbox"} onChange={(e) => handleChange(e, 'published')} /></label>
        </fieldset>
        <button type='submit'>Create Now</button>
      </form>
    </div>
  )
}

export default NewBlogPostForm
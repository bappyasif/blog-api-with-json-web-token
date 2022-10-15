import React, { useState } from 'react'
import { beginUserAuthenticationProcess } from '../utils';
import { Navigate } from 'react-router-dom';
import { RenderErrors } from '../RenderErrors';

function RegisterUser() {
    let [auth, setAuth] = useState(false);
    let [errors, setErrors] = useState([])
    let [userData, setUserData] = useState({})

    let handleAuth = () => {
        setAuth(true);
    }

    let updateError = data => setErrors(data);

    let handleSubmit = event => {
        event.preventDefault();
        beginUserAuthenticationProcess(userData, updateError, "http://localhost:3000/user/register", handleAuth)
    }

    let handleFormControlChange = (event, prop) => setUserData(prev => ({...prev, [prop]: event.target.value}))

  return (
    <div className='regu-container'>
        <h2>Become A Register User</h2>
        {errors.errors?.length ? <RenderErrors errors={errors.errors} /> : null}

        {auth ? <Navigate to={"/blogs"} /> : null}

        <p>all required form fields are denoted with asterics</p>
        <form method='post' action='' onSubmit={handleSubmit}>
            <fieldset>
                <label htmlFor='name'>Fullname: </label>
                <input id='name' type={"text"} name={"name"} onChange={(event) => handleFormControlChange(event, "name")} placeholder="your fullname" autoComplete='name' autoFocus required />
            </fieldset>
            <fieldset>
                <label htmlFor='email'>Email: </label>
                <input id='email' type={"email"} name={"email"} onChange={(event) => handleFormControlChange(event, "email")} placeholder="your email" autoComplete='email' required />
            </fieldset>
            <fieldset>
                <label htmlFor='password'>Password: </label>
                <input id='password' type={"password"} name={"password"} onChange={(event) => handleFormControlChange(event, "password")} placeholder="your password" autoComplete='password' required />
            </fieldset>
            <fieldset>
                <label htmlFor='confirm'>Confirm Password: </label>
                <input id='confirm' type={"password"} name={"confirm"} onChange={(event) => handleFormControlChange(event, "confirm")} placeholder="please retype your password" autoComplete='password' required />
            </fieldset>
            <button type='submit'>Register</button>
        </form>
    </div>
  )
}

export default RegisterUser
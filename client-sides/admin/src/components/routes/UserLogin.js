import React, { useEffect, useState } from 'react'
import { beginUserAuthenticationProcess, getExpiration, isLoggedIn } from '../utils';
import { Navigate } from 'react-router';
import { RenderErrors } from '../RenderErrors';

function UserLogin({auth, setAuth}) {
    let [errors, setErrors] = useState([]);
    let [userData, setUserData] = useState({});

    let updateError = data => setErrors(data);
    
    let handleAuth = () => setAuth(true);

    let handleSubmit = event => {
        event.preventDefault();
        beginUserAuthenticationProcess(userData, updateError, "http://localhost:3000/user/login", handleAuth)
    }

    useEffect(() => {
        let checkTokenAlreadyExistingIsValid = getExpiration();
        if (checkTokenAlreadyExistingIsValid) {
          if (isLoggedIn()) {
            setAuth(true);
          }
        }
      }, [])

    let handleFormControlChange = (event, prop) => setUserData(prev => ({...prev, [prop]: event.target.value}))

    // checking on every errors response if there is no such user, 
    // so that we can allow user to consider registering
    
    errors.length && console.log(errors)

  return (
    <div className='ul-container'>
        <h2>Please Login First To Access Admin Dashboard Panel</h2>
        {errors.errors?.length ? <RenderErrors errors={errors.errors} /> : null}
        {errors?.success === false ? <div className='error'>{errors?.msg}</div>: null}
        {auth ? <Navigate to={"/blogs"} /> : null}

        <form method='post' action='' onSubmit={handleSubmit}>
            <legend>Enter your registered email and password</legend>
            <fieldset>
                <label htmlFor='email'>Email: </label>
                <input id='email' type={"email"} autoComplete="email" onChange={(event) => handleFormControlChange(event, "email")} placeholder="your email goes here" autoFocus required />
            </fieldset>
            <fieldset>
                <label htmlFor='password'>Password: </label>
                <input id='password' type={"password"} autoComplete={"password"} onChange={(event) => handleFormControlChange(event, "password")} placeholder="your password goes here" required />
            </fieldset>
            <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default UserLogin
import React from 'react'
import { Link } from 'react-router-dom';
import { logoutUser } from './utils'

function ShowNavs({ auth, setAuth }) {
  return (
    <nav>
      <ul>
        <li>
          <a className='nav-item' href={"http://127.0.0.1:5500/client-sides/public/index.html"} target={"_blank"}>Blog Site</a>
        </li>
        <li>
          {auth ? null : <Link className='nav-item' to={"/login"}>Login</Link>}
        </li>
        <li>
          {auth ? null : <Link className='nav-item' to={"/register"}>Register</Link>}
        </li>
        <li>
          {auth ? <Link className='nav-item' to={"/blogs"}>Dashboard</Link> : null}
        </li>
        <li>
          {auth ? <Link className='nav-item' to={"/create/blog"}>CreateNewBlog</Link> : null}
        </li>
        <li>
          {auth ? <LogoutButton setAuth={setAuth} /> : null}
        </li>
      </ul>
    </nav>
  )
}

let LogoutButton = ({ setAuth }) => {
  let handleClick = (event) => {
    logoutUser();
    setAuth(false)
  }

  return (
    <Link className='nav-item' to={"/login"} onClick={handleClick}>Logout</Link>
  )
}

export default ShowNavs
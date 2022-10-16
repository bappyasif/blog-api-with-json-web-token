import './App.css';
import BlogPosts from './components/routes/BlogPosts';
import ShowNavs from './components/ShowNavs';
import BlogDetails from "./components/routes/BlogDetails"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ErrorPage from './components/routes/ErrorPage';
import UserLogin from './components/routes/UserLogin';
import RegisterUser from './components/routes/RegisterUser';
import NewBlogPostForm from './components/routes/NewBlogPostForm';
import { useEffect, useState } from 'react';
import { getExpiration, isLoggedIn } from './components/utils';
import CommentForm from './components/routes/CommentForm';
import CommentDelete from './components/routes/CommentDelete';
import PublicSite from './components/routes/PublicSite';

function App() {
  let [auth, setAuth] = useState(false);

  useEffect(() => {
    let checkTokenAlreadyExistingIsValid = getExpiration();
    if (checkTokenAlreadyExistingIsValid) {
      if (isLoggedIn()) {
        setAuth(true);
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <ShowNavs auth={auth} setAuth={setAuth} />
        <Routes>
          <Route path='/' element={<PublicSite />} />
          <Route path='/admin' element={auth ? <Navigate replace to={"/blogs"} /> : <Navigate replace to={"/login"} />} />
          <Route path='/login' element={<UserLogin auth={auth} setAuth={setAuth} />} />
          <Route path='/register' element={<RegisterUser />} />
          <Route path='/blogs' element={auth ? <BlogPosts /> : <Navigate replace to={"/login"} />} />
          <Route path='/create/blog' element={auth ? <NewBlogPostForm /> : <Navigate replace to={"/login"} />} />
          <Route path='blogs/:blogId' element={auth ? <BlogDetails /> : <Navigate replace to={"/login"} />} />
          <Route path='/comments/:commentId' element={auth ? <CommentForm /> : <Navigate replace to={"/login"} />} />
          <Route path='/comments/:commentId/delete' element={auth ? <CommentDelete /> : <Navigate replace to={"/login"} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
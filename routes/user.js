const express = require("express");
const { registerUserPostRequest, registerUserGetRequest, loginFormPostRequest, loginFormGetRequest, redirectToLoginForm } = require("../controllers/user");
const userRoutes = express();

userRoutes.get("/", redirectToLoginForm);

userRoutes.get("/login", loginFormGetRequest);
userRoutes.post("/login", loginFormPostRequest);

userRoutes.get("/register", registerUserGetRequest);
userRoutes.post("/register", registerUserPostRequest);

module.exports = userRoutes;
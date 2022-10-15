const express =  require("express");
const { createNewBlogPost, newBlogPostForm, showAllBlogPosts, redirectToBlogPosts, updateThisBlogPost, getSpecificBlogData } = require("../controllers/blog");
const blogsRoutes = express();

blogsRoutes.get("/", redirectToBlogPosts)
blogsRoutes.get("/all-posts", showAllBlogPosts)

blogsRoutes.get("/posts/:postId", getSpecificBlogData)

blogsRoutes.get("/create", newBlogPostForm)
blogsRoutes.post("/create", createNewBlogPost)

blogsRoutes.put("/update", updateThisBlogPost)

module.exports = blogsRoutes;
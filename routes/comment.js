const express = require("express");
const { postCommentToBlog, commentFormGetRequest, redirectToCommentForm, getCommentsForSpecificBlogPost, deleteComment, updateCommentPostRequest, updateCommentGetRequest } = require("../controllers/comment");
const commentRoutes = express();

commentRoutes.get("/", redirectToCommentForm);

commentRoutes.get("/create", commentFormGetRequest);
commentRoutes.post("/create", postCommentToBlog);

commentRoutes.get("/:blogId/all-comments", getCommentsForSpecificBlogPost)

commentRoutes.delete("/blog/:commentId", deleteComment)

commentRoutes.get("/blog/:commentId", updateCommentGetRequest)
commentRoutes.post("/blog/:commentId", updateCommentPostRequest)

module.exports = commentRoutes;
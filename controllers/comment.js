const { body, validationResult } = require("express-validator");
const CommentSchema =  require("../models/comment");

let redirectToCommentForm = (req, res) => res.redirect("/comment/create")

let commentFormGetRequest = (req, res) => res.send("comment form");

let deleteComment = (req, res, next) => {
    CommentSchema.findByIdAndDelete(req.body.commentId)
    .then(() => {
        console.log("delete successful")
        res.status(200).json({success: true, msg: "comment is deleted successfully"})
    })
    .catch(err => {
        console.error(err)
        return next(err);
    })
}

let updateCommentGetRequest = (req, res, next) => {
    CommentSchema.find({_id: req.params.commentId})
        .then(result => {
            res.status(200).json({success: true, data: result[0]})
        })
        .catch(err => next(err))
}

let updateCommentPostRequest = [
    body("email", "value must be of email type")
    .trim().isEmail().escape(),
    body("name", "filed can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("body", "filed can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("posted", "filed can not be left empty")
    .trim().isDate().escape(),
    (req, res, next) => {
        let errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(402).json({success: false, errors: errors.array()})
            return
        }

        let commentData = {
            _id: req.body._id,
            email: req.body.email,
            name: req.body.name,
            body: req.body.body,
            blogPost: req.body.blogPost,
            posted: new Date().toISOString()
        }

        CommentSchema.findByIdAndUpdate(req.body._id, commentData, {}, (err, _) => {
            if(err) return next(err)

            console.log("successfully updated")
            res.status(200).json({success: true, msg: "successfully updated"})
        })
    }
]

let getCommentsForSpecificBlogPost = (req, res) => {
    CommentSchema.find({blogPost: req.params.blogId})
    .then(result => res.status(200).json({success: true, data: result}))
    .catch(err => {
        console.error(err);
        res.status(402).json({success: false, msg: "no comments are found"})
    })
}

let postCommentToBlog = [
    body("email", "value must be of email type")
    .trim().isEmail().escape(),
    body("name", "name field must be 2 or more characters long")
    .trim().isLength({min: 2}).escape(),
    body("body", "body field must be 4 or more characters long")
    .trim().isLength({min: 4}).escape(),
    body("blogPost", "blogId can not be left empty")
    .trim().isAlphanumeric().escape(),
    (req, res, next) => {
        let errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(402).json({success: false, errors: errors.array()})
            return
        }
        let newComment = new CommentSchema({
            email: req.body.email,
            name: req.body.name,
            body: req.body.body,
            blogPost: req.body.blogPost,
            posted: new Date().toISOString()
        })

        newComment.save((err) => {
            if(err) return next(err)
            console.log("comment posted")
            // res.send("/blog")
            res.status(200).json({success: true, msg: "comment is posted successfully"})
        })
    }
];

module.exports = {
    redirectToCommentForm,
    commentFormGetRequest,
    postCommentToBlog,
    getCommentsForSpecificBlogPost,
    updateCommentGetRequest,
    updateCommentPostRequest,
    deleteComment
}
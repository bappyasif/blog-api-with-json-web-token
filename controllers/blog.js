const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const PostSchema = require("../models/post");

let redirectToBlogPosts = (req, res) => res.redirect("/blog/all-posts");

let getSpecificBlogData = (req, res, next) => {
    PostSchema.find({_id: req.params.postId})
        .then(data => {
            res.status(200).json({ success: true, blogData: data });
        }).catch(err => next(err))
}

let showAllBlogPosts = (req, res, next) => {
    PostSchema.find()
        .then(posts => {
            res.status(200).json({ success: true, posts: posts });
        }).catch(err => next(err))
};

let newBlogPostForm = (req, res) => res.send("getting inputs for a new post");

let createNewBlogPost = [
    body("title", "must be over 2 characters long")
        .trim().isLength({ min: 2 }).escape(),
    body("body", "must be over 4 characters long")
        .trim().isLength({ min: 4 }).escape(),
    body("authorName", "must be over 2 characters long")
        .trim().isLength({ min: 2 }).escape(),
    body("published", "can not be null")
        .isBoolean().escape(),
    body("posted", "can not be empty")
        .trim().isDate().escape(),

    (req, res, next) => {
        let errors = validationResult(req);

        let blogData = {
            title: req.body.title,
            body: req.body.body,
            author: req.body.uid,
            authorName: req.body.authorName,
            posted: req.body.posted || Date.now(),
            published: req.body.published || true
        }

        if (!errors.isEmpty()) {
            res.status(402).json({ blogData: blogData, errors: errors.array() })
            return
        }

        let newBlog = new PostSchema(blogData)

        newBlog.save((err, _) => {
            if(err) return next(err);

            console.log("new post is saved");
            res.send("created a new post")
        })
    }
]

let updateThisBlogPost = (req, res, next) => {
    PostSchema.findById({ _id: req.body._id })
        .then(result => {
            result.published = !result.published;
            PostSchema.findByIdAndUpdate(result._id, result, {}, (err, _) => {
                if (err) return next(err)
                console.log("successfully updated")
                res.redirect("/")
            })
        })
}

module.exports = {
    redirectToBlogPosts,
    showAllBlogPosts,
    newBlogPostForm,
    createNewBlogPost,
    updateThisBlogPost,
    getSpecificBlogData
}
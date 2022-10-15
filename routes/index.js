const express = require("express");
const blogsRoutes = require("./blog");
const commentRoutes = require("./comment");
const userRoutes = require("./user");
const router = express();

router.get("/", (req, res) => res.redirect("/blog"))
router.use("/user", userRoutes);
router.use("/blog", blogsRoutes);
router.use("/comment", commentRoutes);

module.exports = router
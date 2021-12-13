// import express
const express = require("express");

// call router
const router = express.Router();

//// register routes
// handle route to nothing - redirect to /posts
router.get("/", function(req, res) {
  // serve redirect
  res.redirect("/posts");
});

// handle request to /posts
router.get("/posts", function(req, res) {
  // serve post-lists.ejs
  res.render("posts-list");
});

// handle request to /new-post
router.get("/new-post", function (req, res) {
  // serve create-post.ejs
  res.render("create-post");
});

// export router
module.exports = router;
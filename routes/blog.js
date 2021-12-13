// import express
const express = require("express");

// import mysql module from database.js
const db = require("../data/database");

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
router.get("/new-post", async function (req, res) {
  // use db query method - ASYNCHRONIC!
  const [authors] = await db.query("SELECT * FROM authors");
  // serve create-post.ejs
  // pass data
  res.render("create-post", { authors: authors});
});

// export router
module.exports = router;
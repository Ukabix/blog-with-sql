// import express
const express = require("express");

// import mysql module from database.js
const db = require("../data/database");

// call router
const router = express.Router();

//// register routes
// handle route to nothing - redirect to /posts
router.get("/", function (req, res) {
  // serve redirect
  res.redirect("/posts");
});

// handle get request to /posts
router.get("/posts", async function (req, res) {
  // improve readability
  const query= `
  SELECT posts.*, authors.name AS author_name FROM posts
  INNER JOIN authors ON posts.author_id = authors.id`;
  // fetch posts - ^ INNER JOIN because we want to display the author too + array destructure
  const [posts] = await db.query(query);
  // serve posts-lists.ejs
  res.render("posts-list", { posts: posts });
});

// handle get request to /new-post
router.get(
  "/new-post",
  async function (req, res) {
    // use db query method - ASYNC!
    const [authors] = await db.query(
      "SELECT * FROM authors"
    );
    // serve create-post.ejs
    // pass data
    res.render("create-post", {
      authors: authors,
    });
  }
);

// handle request to /posts - from form action in create-post.ejs, async again
router.post("/posts", async function (req, res) {
  // construct data array to be injected - keys are defined as names in create-post.ejs form parts lines 16 +
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  // mysql2 replaces ? with data from array passed as param
  await db.query(
    "INSERT INTO posts (title, summary, body, author_id) VALUES (?)",
    [data]
  );
  // redirect to posts list after form submission
  res.redirect("/posts");
});

// handle request to dynamic post detail
router.get("/posts/:id", async function (req, res) {
  // make an sql query
  const query = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email
    FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?
  `;
  // get placeholder id in array
  const [posts] = await db.query(query, [req.params.id]);
  // handle invalid manual input if post does not exist
  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  // handle better data formatting
  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  // render template
  res.render("post-detail", { post: postData });
});

// handle request for post update
router.get("/posts/:id/edit", async function(req, res){
  // select all data for post
  const query = `
  SELECT * FROM posts
  WHERE id = ?
  `;
  // get placeholder id in array
  const [posts] = await db.query(query, [req.params.id]);
  // handle invalid manual input if post does not exist
  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }
  // render template
  res.render("update-post", { post: posts [0]});
});


// export router
module.exports = router;

// import mysql2
const mysql = require("mysql2");

// create connection pool - JSON
const pool = mysql.createPool({
  host: "localhost",
  database: "blog",
  user: "root",
  password: "pass1"
});

// export pool
module.exports = pool;
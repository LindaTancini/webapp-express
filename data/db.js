const mysql = require("mysql2");
// Connessione al db
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "booleanlinda",
  database: "db_movie",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Sono connesso al db MySQL!");
});

module.exports = connection;

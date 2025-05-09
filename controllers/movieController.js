//Connetto il db
const connection = require("../data/db");
//Index
function index(req, res) {
  //Query
  const sql = `SELECT * from movies;`;
  //Eseguo la query
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "La query al db è fallita" });
    res.json(results);
  });
}

//Show
function show(req, res) {
  res.send("Sono lo show dei film");
}

module.exports = {
  index,
  show,
};

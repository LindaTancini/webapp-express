//Connetto il db
const connection = require("../data/db");
//Index
function index(req, res) {
  //Query con media delle recensioni
  const sql = `
  SELECT 
    movies.*, AVG(reviews.vote) AS media_recensioni
  FROM 
    movies
  LEFT JOIN 
    reviews 
    ON movies.id = reviews.movie_id
  GROUP BY 
    movies.id;`;
  //Eseguo la query
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "La query al db è fallita" });
    //Inserimento immagini
    const movieImg = results.map((result) => ({
      ...result,
      imgPath: process.env.PUBLIC_PATH + "/img/" + result.image,
    }));
    res.json(movieImg);
  });
}

//Show
function show(req, res) {
  const { id } = req.params;
  //Query
  const sql = `SELECT * FROM movies WHERE id = ?`;
  // Query Review
  const sqlReview = `SELECT * FROM reviews WHERE movie_id = ?`;
  //Eseguo la query
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "La query al db è fallita" });
    if (results.length === 0)
      return res.status(404).json({ error: "Il post non è stato trovato" });
    //Invio la risposta e inserisco le immagini
    const movie = {
      ...results[0],
      imgPath: process.env.PUBLIC_PATH + "/img/" + results[0].image,
    };
    //Eseguo la query per la review
    connection.query(sqlReview, [id], (err, resultsReview) => {
      if (err)
        return res.status(500).json({ error: "La query al db è fallita" });
      movie.reviews = resultsReview;
      res.json(movie);
    });
  });
}

module.exports = {
  index,
  show,
};

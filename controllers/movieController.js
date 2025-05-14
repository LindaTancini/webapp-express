//Connetto il db
const connection = require("../data/db");
//Index
function index(req, res) {
  const { search } = req.query;
  //Array per i parametri
  const searchParams = [];
  //Query con media delle recensioni
  let sql = `
  SELECT 
    movies.*, ROUND(AVG(reviews.vote), 2) AS reviews_vote
  FROM 
    movies
  LEFT JOIN 
    reviews 
    ON movies.id = reviews.movie_id
  `;
  //Filtro per la ricerca
  if (search) {
    sql += ` 
        WHERE title LIKE ? OR director LIKE ? OR abstract LIKE ?
        `;
    searchParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += ` GROUP BY movies.id`;
  //Eseguo la query
  connection.query(sql, searchParams, (err, results) => {
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
  //const sql = `SELECT * FROM movies WHERE id = ?`;
  const sql = `
  SELECT 
    movies.*, ROUND(AVG(reviews.vote), 2) AS reviews_vote
  FROM 
    movies
  LEFT JOIN 
    reviews 
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?
  `;
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

// Store ->  creazione recensione
function storeReview(req, res) {
  //ID richiesta
  const { id } = req.params;
  //Corpo richiesta
  const { name, vote, text } = req.body;
  //Query
  const sql = `INSERT INTO reviews (movie_id, name, vote, text)
   VALUES (?, ?, ?, ?);`;

  connection.query(sql, [id, name, vote, text], (err, results) => {
    if (err) return res.status(500).json({ error: "La query al db è fallita" });

    res.status(201);
    res.json({
      id,
      name,
      vote,
      text,
    });
  });
}

// Store -> creazione film
function store(req, res) {
  //Corpo richiesta
  const { title, director, genre, abstract } = req.body;
  //Query
  const sql = `INSERT INTO movies (title, director, genre, abstract)
   VALUES (?, ?, ?, ?);`;

  connection.query(sql, [title, director, genre, abstract], (err, results) => {
    if (err) return res.status(500).json({ error: "La query al db è fallita" });

    res.status(201);
    res.json({ message: "Ho aggiunto un film" });
  });
}

module.exports = {
  index,
  show,
  store,
  storeReview,
};

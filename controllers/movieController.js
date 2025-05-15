//Connetto il db
const connection = require("../data/db");
const slugify = require("slugify");
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
  const { slug } = req.params;
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
    WHERE movies.slug = ?
  `;
  // Query Review
  const sqlReview = `SELECT * FROM reviews WHERE movie_id = ?`;
  //Eseguo la query
  connection.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ error: "La query al db è fallita" });
    if (results.length === 0 || results[0]?.id === null)
      return res.status(404).json({ error: "Il post non è stato trovato" });
    //Invio la risposta e inserisco le immagini
    const movie = {
      ...results[0],
      imgPath: process.env.PUBLIC_PATH + "/img/" + results[0].image,
    };
    //Eseguo la query per la review
    connection.query(sqlReview, [results[0].id], (err, resultsReview) => {
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
  //Creo variabile per inserire immagini
  const imgName = req.file.filename;
  console.log(imgName);
  //Query
  const sql = `INSERT INTO movies (title, director, genre, abstract, image, slug)
   VALUES (?, ?, ?, ?, ?, ?);`;

  const slug = slugify(title, {
    lower: true,
    trim: true,
  });

  connection.query(
    sql,
    [title, director, genre, abstract, imgName, slug],
    (err, results) => {
      if (err)
        return res.status(500).json({ error: "La query al db è fallita" });

      res.status(201);
      res.json({ message: "Ho aggiunto un film" });
    }
  );
}

// Prev -> Prendo il film precedente
function prev(req, res) {
  const slug = req.params.slug;

  connection.query(
    `SELECT id FROM movies WHERE slug = ?`,
    [slug],
    (err, results) => {
      if (err)
        return res.status(500).json({ error: "La query al db è fallita" });
      if (results.length === 0)
        return res.status(404).json({ error: "Film non trovato" });

      const currentId = results[0].id;
      // Quert
      connection.query(
        `SELECT slug FROM movies WHERE id < ? ORDER BY id DESC LIMIT 1`,
        [currentId],
        (err, resultsPrev) => {
          if (err) return res.status(500).json(err);
          if (resultsPrev.length === 0) return res.status(404).json({});

          res.json({ slug: resultsPrev[0].slug });
        }
      );
    }
  );
}

// Next -> Prendo il film successivo
function next(req, res) {
  const slug = req.params.slug;

  // Prima prendi il film corrente per ottenere l'id
  connection.query(
    `SELECT id FROM movies WHERE slug = ?`,
    [slug],
    (err, results) => {
      if (err)
        return res.status(500).json({ error: "La query al db è fallita" });
      if (results.length === 0) return res.status(404).json(err);

      const currentId = results[0].id;
      // Query
      connection.query(
        `SELECT slug FROM movies WHERE id > ? ORDER BY id ASC LIMIT 1`,
        [currentId],
        (err, resultsNext) => {
          if (err) return res.status(500).json({ error: "Errore DB" });
          if (resultsNext.length === 0) return res.json({ slug: null });

          res.json({ slug: resultsNext[0].slug });
        }
      );
    }
  );
}

module.exports = {
  index,
  show,
  store,
  storeReview,
  prev,
  next,
};

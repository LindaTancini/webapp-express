//Express
const express = require("express");
const app = express();
const db = require("./data/db");
const port = 3000;
//HomePage
app.get("/", (req, res) => {
  res.send("Homepage della Webapp!");
});
//Body-parser
app.use(express.json());
//Route
const movieRoutes = require("./routers/movies.js");
app.use("/api/movies", movieRoutes);
//Middlewares
const notFound = require("./middlewares/notFound.js");
const errorHandler = require("./middlewares/errorHandler.js");
//Assets statici (rendo visibili le img)
app.use(express.static("public"));
//404
app.use(notFound);
//500
app.use(errorHandler);
// Avvio server
app.listen(port, () => {
  console.log(`Sono un server attivo sulla porta:${port}`);
});

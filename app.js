//Express
const express = require("express");
const app = express();
const port = 3000;
//HomePage
app.get("/", (req, res) => {
  res.send("Homepage della Webapp!");
});
//Body-parser
app.use(express.json());
//Middlewares
const notFound = require("./middlewares/notFound.js");
const errorHandler = require("./middlewares/errorHandler.js");
//404
app.use(notFound);
//500
app.use(errorHandler);
// Avvio server
app.listen(port, () => {
  console.log(`Sono un server attivo sulla porta:${port}`);
});

const express = require("express");
const router = express.Router();
//Importo i controller
const movieControlls = require("../controllers/movieController");

// INDEX -> visualizzo tutti i posts
router.get("/", movieControlls.index);
// SHOW -> visualizzo un solo post
router.get("/:id", movieControlls.show);

module.exports = router;

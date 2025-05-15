const express = require("express");
const router = express.Router();
//Importo i controller
const movieControlls = require("../controllers/movieController");
const upload = require("../middlewares/multer");

// INDEX -> visualizzo tutti i posts
router.get("/", movieControlls.index);
// PREV -> restituisce lo slug del film precedente
router.get("/:slug/prev", movieControlls.prev);
// NEXT -> restituisce lo slug del film successivo
router.get("/:slug/next", movieControlls.next);
// SHOW -> visualizzo un solo post
router.get("/:slug", movieControlls.show);
// STORE -> creo un nuovo film
router.post("/", upload.single("image"), movieControlls.store);
// STORE -> creo una nuova recensione
router.post("/:id/reviews", movieControlls.storeReview);

module.exports = router;

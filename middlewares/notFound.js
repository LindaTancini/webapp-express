function notFound(req, res, next) {
  res.status(404).json({
    errorStatus: 404,
    errorMessage: "Pagina non trovata, errore!",
  });
}

module.exports = notFound;

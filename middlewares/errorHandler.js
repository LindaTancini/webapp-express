function errorHandler(err, req, res, next) {
  res.status(500).json({
    errorStatus: 500,
    errorMessage: err.message,
  });
}

module.exports = errorHandler;

exports.invalidApiErrHandler = (req, res, next) => {
  res.status(404).send({ message: "invalid endpoint" });
};

exports.customErrorsHandler = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};
exports.serverErrHandler = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};

exports.endpointHandler = (req, res, next) => {
  next({
    status: 404,
    message: "invalid endpoint",
  });
};

exports.psqlErrHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "bad request" });
  }
  next(err);
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

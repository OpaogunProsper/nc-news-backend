exports.endpointHandler = (req, res, next) => {
  next({
    status: 404,
    message: "invalid endpoint",
  });
};
exports.dbErrHandler = (err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
};
exports.foreignKeyErrHandler = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "user not found" });
  }
  next(err);
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

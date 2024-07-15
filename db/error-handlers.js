exports.serverErrHandler = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};

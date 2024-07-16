const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  serverErrHandler,
  invalidApiErrHandler,
  customErrorsHandler,
} = require("./errors/error-handlers");
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.all("*", invalidApiErrHandler);

app.use(serverErrHandler);

app.use(customErrorsHandler);
module.exports = app;

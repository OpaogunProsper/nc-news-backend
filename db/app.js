const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("../db/controllers/articles.controllers");
const {
  serverErrHandler,
  customErrorsHandler,
  psqlErrHandler,
  endpointHandler,
} = require("./errors/error-handlers");
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.all("*", endpointHandler);

app.use(psqlErrHandler);
app.use(customErrorsHandler);
app.use(serverErrHandler);
module.exports = app;

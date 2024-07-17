const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controllers");
const { getComments } = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
} = require("../db/controllers/articles.controllers");
const {
  serverErrHandler,
  customErrorsHandler,
  psqlErrHandler,
  endpointHandler,
  thisHandler,
} = require("./errors/error-handlers");
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.all("*", endpointHandler);

app.use(thisHandler);
app.use(psqlErrHandler);
app.use(customErrorsHandler);
app.use(serverErrHandler);
module.exports = app;

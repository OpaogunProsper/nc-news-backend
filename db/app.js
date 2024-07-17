const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controllers");
const { getComments, postComment } = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
} = require("../db/controllers/articles.controllers");
const {
  serverErrHandler,
  customErrorsHandler,
  foreignKeyErrHandler,
  psqlErrHandler,
  endpointHandler,
  dbErrHandler,
} = require("./errors/error-handlers");
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);
app.all("*", endpointHandler);

app.use(dbErrHandler);
app.use(foreignKeyErrHandler);
app.use(psqlErrHandler);
app.use(customErrorsHandler);
app.use(serverErrHandler);
module.exports = app;

const express = require("express");
const cors = require("cors")
const app = express();
const { getApi } = require("./controllers/api.controllers");
const {
  getComments,
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
  patchArticle,
} = require("../db/controllers/articles.controllers");
const {
  serverErrHandler,
  customErrorsHandler,
  foreignKeyErrHandler,
  psqlErrHandler,
  endpointHandler,
  dbErrHandler,
} = require("./errors/error-handlers");
const { getUsers } = require("./controllers/users.controller");
app.use(cors())
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers)
app.all("*", endpointHandler);

app.use(dbErrHandler);
app.use(foreignKeyErrHandler);
app.use(psqlErrHandler);
app.use(customErrorsHandler);
app.use(serverErrHandler);
module.exports = app;

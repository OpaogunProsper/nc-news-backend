const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const { serverErrHandler } = require("./error-handlers");
app.use(express.json());
app.get("/api/topics", getTopics);
app.use(serverErrHandler);
module.exports = app;

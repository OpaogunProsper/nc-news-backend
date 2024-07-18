const {
  selectArticleById,
  fetchArticles,
  updateArticle,
} = require("../models/articles.models");
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.getAllArticles = (req, res, next) => {
  const{ query }= req
  const {sort_by, order} = req.query
  fetchArticles(query, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) =>{
      next(err)
    });
};
exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticle(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

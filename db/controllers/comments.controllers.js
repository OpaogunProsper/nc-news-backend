const {
  selectCommentsByArticleId,
  addComments,
} = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  selectCommentsByArticleId(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  addComments(req.params.article_id, body)
    .then((result) => {
      res.status(201).send({ result });
    })
    .catch((err) => {
      next(err);
    });
};

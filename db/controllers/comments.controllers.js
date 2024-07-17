const { selectCommentsByArticleId } = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  selectCommentsByArticleId(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

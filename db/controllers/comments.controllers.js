const {
  selectCommentsByArticleId,
  addComments,
  removeCommentById,
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
exports.deleteCommentById = (req, res, next) => {
removeCommentById(req.params.comment_id)
.then(() =>{
  res.sendStatus(204)
})
.catch((err) => {
  next(err)
})
}

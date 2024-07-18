const db = require("../../db/connection");
const { checkArticleExists } = require("../../db/seeds/utils");

exports.selectCommentsByArticleId = (article_id) => {
  const queryValues = [];
  let sqlString = `SELECT * FROM comments`;
  if (article_id) {
    sqlString += ` WHERE article_id=$1`;
    queryValues.push(article_id);
  }

  sqlString += ` ORDER BY created_at DESC;`;

  const promiseArr = [];

  promiseArr.push(db.query(sqlString, queryValues));

  if (article_id !== undefined) {
    promiseArr.push(checkArticleExists(article_id));
  }

  return Promise.all(promiseArr).then(([queryResults, articleResults]) => {
    if (queryResults.rows.length === 0 && articleResults === false) {
      return Promise.reject({ status: 404, message: "article not found" });
    }
    return queryResults.rows;
  });
};
exports.addComments = (article_id, req) => {
  const { username, body } = req;
  return checkArticleExists(article_id).then((result) => {
    if (!result) {
      return Promise.reject({ status: 404, message: "article not found" });
    }

    return db
      .query(
        `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
        [body, username, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments 
        WHERE comment_id=$1
        RETURNING *
        ;`,
      [comment_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "comment not found",
        });
      }
    });
};

const db = require("../connection");

exports.selectArticleById = (article_id) => {
  const queryString = `SELECT articles.author,
        articles.title,
        articles.body,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url, 
       CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
         WHERE articles.article_id=$1
        GROUP BY articles.article_id;`;
  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "article not found" });
    }
    return rows[0];
  });
};
exports.fetchArticles = (query, sort_by = "created_at", order = "desc") => {
  const allowedSort = [
    "title",
    "author",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const allowedOrder = ["asc", "desc", "ASC", "DESC"];
  for (let key in query) {
    if (key != "sort_by" && key != "order") {
      return Promise.reject({
        status: 400,
        message: "bad request",
      });
    }
  }

  if (!allowedSort.includes(sort_by) || !allowedOrder.includes(order)) {
    return Promise.reject({
      status: 404,
      message: "not found",
    });
  }
  const queryString = `SELECT articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
         ORDER BY ${sort_by} ${order}
        ;`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticle = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles 
        SET votes = (votes + $1)
        WHERE article_id=$2
        RETURNING *
        ;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return rows[0];
    });
};

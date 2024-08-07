const request = require("supertest");
const app = require("../db/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const endpointsData = require("../endpoints.json");
const comments = require("../db/data/test-data/comments");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("express server", () => {
  describe("invalid endpoint", () => {
    it("GET:404 Responds with a 404 status and an error message when given an endpoint that does not exist", () => {
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid endpoint");
        });
    });
  });
  describe("/api", () => {
    it("GET 200: Responds with all available endpoints ", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;
          expect(endpoints.length).toBe(endpointsData.length);
          expect(endpoints).toEqual(endpointsData);
        });
    });
  });
  describe("/api/topics", () => {
    it("GET 200: Responds with an array of topic objects containing only the description and slug properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    it("GET 200: Responds with an article object having author, title, article_id, body, topic, created_at, votes and article_img_url as properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    it("GET 200: Responds with an article object having comment_count as added property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
    });
  });
  describe("err-handling tests for article id", () => {
    it("GET 404: Responds with appropriate status and  error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/922")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("article not found");
        });
    });
    it("GET 400: Responds with appropriate status and error message when the wrong data type is inputted as the article id", () => {
      return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET 200: Responds with all the articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
        });
    });

    it("GET 200: Responds with ordered articles by dates in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    describe("/api/articles/:article_id/comments", () => {
      it("GET 200: Responds with an array of comments for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              });
            });
          });
      });
      it("GET 200: Serves comments based off the most recent ones", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("GET 200: Responds with and empty array if the article_id is valid  but isn't attached to any comment", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toEqual([]);
          });
      });
      it("GET 404: Responds with appropriate error message and status when a valid article id is given but the article does not exist", () => {
        return request(app)
          .get("/api/articles/55/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("article not found");
          });
      });
      it("GET 400: Responds with appropriate error message and status when an invalid search is performed", () => {
        return request(app)
          .get("/api/articles/badreq/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("bad request");
          });
      });
    });
    describe("POST/api/articles/:article_id/comments ", () => {
      it("POST 201: Inserts a new comment and responds with the posted object", () => {
        const reqBody = {
          body: "This is some kinda test comment, so vote for me",
          username: "butter_bridge",
        };

        return request(app)
          .post("/api/articles/11/comments")
          .send(reqBody)
          .expect(201)
          .then(({ body }) => {
            const { result } = body;

            expect(result.body).toBe(reqBody.body);
            expect(result.author).toBe(reqBody.username);
            expect(result.votes).toBe(0);
            expect(result.article_id).toBe(11);
            expect(typeof result.comment_id).toBe("number");
            expect(typeof result.created_at).toBe("string");
          });
      });
      it("POST 400: Responds with appropriate status and error message when given invalid id data-type", () => {
        return request(app)
          .post("/api/articles/not-a-number/comments")
          .send({
            username: "butter_bridge",
            body: "Catching up",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("bad request");
          });
      });

      it("POST 404: Responds with appropriate error message and status when a valid article id is given but the article does not exist", () => {
        return request(app)
          .post("/api/articles/55/comments")
          .send({
            username: "butter_bridge",
            body: "Catching up",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("article not found");
          });
      });

      it("POST 404: Responds with appropriate status and error message when username is not referenced", () => {
        return request(app)
          .post("/api/articles/10/comments")
          .send({
            username: "prblark",
            body: "Catching up now",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("user not found");
          });
      });
    });
    describe("PATCH /api/articles/:article_id ", () => {
      it("PATCH 200: Updates an article by article_id and responds with the updated article", () => {
        const reqBody = {
          inc_votes: 1,
        };
        return request(app)
          .patch("/api/articles/4")
          .send(reqBody)
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article).toMatchObject({
              article_id: 4,
              votes: 1,
            });
          });
      });
      it("PATCH 400: Responds with appropriate status and error message when given invalid id data-type", () => {
        return request(app)
          .patch("/api/articles/not-a-number")
          .send({
            inc_votes: 1,
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("bad request");
          });
      });
      it("PATCH 404: Responds with appropriate error message and status when a valid article id is given but the article does not exist", () => {
        return request(app)
          .patch("/api/articles/555")
          .send({
            inc_votes: 1,
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("article not found");
          });
      });
      it("PATCH 400: invalid data type for the inc_votes property", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: "not-a-number" })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("bad request");
          });
      });
    });
    describe("DELETE /api/comments/:comment_id", () => {
      it("DELETE 204: Deletes the given comment by id and responds with no content", () => {
        return request(app).delete("/api/comments/4").expect(204);
      });
      it("DELETE 400: Responds with an appropriate status and error message when provided with an invalid comment_id data-type", () => {
        return request(app)
          .delete("/api/comments/not-a-number")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("bad request");
          });
      });

      it("DELETE 404: Responds with an appropriate status and error message when given a valid but non-existent comment_id", () => {
        return request(app)
          .delete("/api/comments/99")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("comment not found");
          });
      });
    });
    describe("GET /api/users", () => {
      it("GET 200: Responds with an array of objects having username, name and avatar_url as properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
            });
          });
      });
    });

    describe("GET /api/article?sort_by=query&order=asc/desc", () => {
      it("GET 200: Responds with an array of article objects sorted by title ", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("title", {
              descending: true,
            });
          });
      });

      it("GET 200: Responds with an array of article objects sorted by topic in ascending order(can handle two queries) ", () => {
        return request(app)
          .get("/api/articles?sort_by=topic&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("topic", { descending: false });
          });
      });

      it("GET 404: Responds with appropriate error message when invalid column is given to sort_by", () => {
        return request(app)
          .get("/api/articles?sort_by=no_column")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toEqual("not found");
          });
      });
      it("GET 404: Responds with appropriate error message when query is invalid ordering criteria", () => {
        return request(app)
          .get("/api/articles?sort_by=topic&order=invalid-order")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toEqual("not found");
          });
      });
      it("GET 400:Responds with appropriate error message when a query-type asides sort_by or order is given", () => {
        return request(app)
          .get("/api/articles?odd=desc")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toEqual("bad request");
          });
      });
    });
  });
});

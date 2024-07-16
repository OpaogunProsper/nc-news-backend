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
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
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
            expect(article).not.toHaveProperty("body");
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });

    it("GET 200: Responds with the number of comments referencing article_id", () => {
      const countObj = {};
      comments.forEach((comment) => {
        let { article_id } = comment;
        countObj[article_id] = countObj[article_id]
          ? countObj[article_id] + 1
          : 1;
      });
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            if (article.comment_count != "0") {
              expect(article.comment_count).toBe(
                countObj[article.article_id].toString()
              );
            }
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
  });
});

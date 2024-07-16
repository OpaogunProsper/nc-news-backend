const request = require("supertest");
const app = require("../db/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const endpointsData = require("../endpoints.json");

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
});

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
});

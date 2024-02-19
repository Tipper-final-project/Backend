const request = require("supertest");
const app = require("../app");
const client = require("../db/connection");
const data = require("../db/data/testData");
const db = client.db("test_db");
const waiters = db.collection("waiters");
const fs = require("fs/promises");

beforeAll(async () => {
  await waiters.drop();
  await db.createCollection("waiters");
  await waiters.insertMany(data);
});
afterAll(async () => {
  await client.close();
});
describe("Tesing all the endpoints", () => {
  describe("POST /waiter", () => {
    test("201: posts a new waiter", async () => {
      const response = await request(app).post("/waiter").send({
        username: "user1",
        email: "user1@gmail.com",
        workPlace: "Mcdonalds",
        bio: "hi im user1 and I really need these tips for my startup",
        img_url:
          "https://static.wikia.nocookie.net/theregularshow/images/9/96/Teen_Mordecai.png/revision/latest?cb=20230930020729",
      });
      expect(response.status).toBe(201);
    });
    test("400: when a username already exitsts in the db", async () => {
      const response = await request(app).post("/waiter").send({
        username: "user1",
        bio: "hi im user1 and I really need these tips for my startup",
        email: "user@gmail.com",
        workPlace: "Mcdonalds",
        img_url:
          "https://static.wikia.nocookie.net/theregularshow/images/9/96/Teen_Mordecai.png/revision/latest?cb=20230930020729",
      });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("username exists");
    });
    test("400: when trying to post without the required object keys", async () => {
      const response = await request(app).post("/waiter").send({
        username: "user6",
        bio: "hi im user1 and I really need these tips for my startup",
        workPlace: "Mcdonalds",
        img_url:
          "https://static.wikia.nocookie.net/theregularshow/images/9/96/Teen_Mordecai.png/revision/latest?cb=20230930020729",
      });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("details required not completed");
    });
  });
  describe("GET /waiter/username", () => {
    test("200: gets the waiter required", async () => {
      const response = await request(app).get("/waiter/user1");
      const { waiter } = response.body;
      expect(response.status).toBe(200);
      expect(waiter.username).toBe("user1");
      expect(waiter.email).toBe("user1@gmail.com");
      expect(typeof waiter.bio).toBe("string");
      expect(waiter.workPlace).toBe("Mcdonalds");
      expect(waiter.img_url).toBe(
        "https://static.wikia.nocookie.net/theregularshow/images/9/96/Teen_Mordecai.png/revision/latest?cb=20230930020729"
      );
    });
    test("404: when a user does not exit", async () => {
      const response = await request(app).get("/waiter/user1000");
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Not found");
    });
  });
  describe("PATCH /waiter/username", () => {
    test("200: updates the user's details", async () => {
      const response = await request(app)
        .patch("/waiter/user1")
        .send({ workPlace: "5 Guys" });
      const { waiter } = response.body;
      expect(response.status).toBe(200);
      expect(waiter.workPlace).toBe("5 Guys");
    });
    test("400: when changing a username to one that exists", async () => {
      const response = await request(app)
        .patch("/waiter/user1")
        .send({ username: "user2" });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("username exists");
    });
    test("400: when changing an email to one that exists", async () => {
      const response = await request(app)
        .patch("/waiter/user1")
        .send({ email: "user2@gmail.com" });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("email exists");
    });
  });
  describe("DELETE /waiter/username", () => {
    test("200: deletes the profile", async () => {
      const response = await request(app).delete("/waiter/user1");
      const response1 = await waiters.findOne({ username: "user1" });
      expect(response1).toBe(null);
      expect(response.status).toBe(204);
    });
  });
  describe("GET /", () => {
    test("200: returns the available endpoints", async () => {
      const response = await request(app).get("/");
      const { endpoints } = response.body;
      const availableEndpoints = await fs.readFile(
        `${__dirname}/../endpoints.json`,
        "utf-8"
      );
      expect(endpoints).toEqual(availableEndpoints);
    });
  });
});

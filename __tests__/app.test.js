const request = require("supertest");
const app = require("../app");
const client = require("../db/connection");
const data = require("../db/data/testData");
const db = client.db("test_db");
const waiters = db.collection("waiters");
const messages = db.collection("user2's messages");
const fs = require("fs/promises");

beforeAll(async () => {
  await waiters.drop();
  await messages.drop();
  await db.createCollection("waiters");
  await db.createCollection("user2's messages");
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
        firstName: "user",
        lastName: "test",
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
  describe("POST /payments", () => {
    test("201: posts a session ID", async () => {
      const response = await request(app).post("/payments").send({
        sessionID:
          "cs_test_a14tI3fmmcCb5iPyyqlhs0R6yyktItkU5BeDABAB9ElQXAoUaeZwFn8e7G",
      });
      expect(response.status).toBe(201);
    });
  });
  describe("GET /payments", () => {
    test("200: returns the available payments", async () => {
      const response = await request(app).get("/payments");
      response.body.payments.map((payment) => {
        expect(typeof payment.sessionID).toBe("string");
      });
    });
  });
  describe("GET /check:username ", () => {
    test("200: when a username is found", async () => {
      const response = await request(app).get("/check/user2");
      expect(response.status).toBe(200);
      expect(response.body.userExists).toBe(true);
    });
    test("200: when a username does not exist", async () => {
      const response = await request(app).get("/check/lee");
      expect(response.status).toBe(200);
      expect(response.body.userExists).toBe(false);
    });
  });
  describe("POST /messages/:username", () => {
    test("200: posts a message to the db", async () => {
      const response = await request(app)
        .post("/messages/user2")
        .send({ date: new Date(), recieved: 10 });

      expect(response.status).toBe(201);
    });
    test("400: when posting a messages without required fields", async () => {
      const response = await request(app)
        .post("/messages/eileen")
        .send({ recieved: 20 });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("details required not completed");
    });
  });
  describe("GET /messages/:username", () => {
    test("200: gets a messages from the db", async () => {
      const response = await request(app).get("/messages/user2");
      const { messages } = response.body;
      expect(response.status).toBe(200);
      expect(Array.isArray(messages)).toBe(true);
      expect(messages[0].recieved).toBe(10);
    });
    test("404: when trying to get messages but a user doesnt exist", async () => {
      const response = await request(app).get("/messages/amir");
      const { msg } = response.body;
      expect(response.status).toBe(404);
      expect(msg).toBe("user does not exist");
    });
  });
});

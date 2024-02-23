const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors");
const {
  addWaiter,
  getWaiter,
  updateWaiter,
  deleteWaiter,
  getEndpoints, addPayment,
} = require("./MVC/controllers/app.controllers");

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

app.post("/waiter", addWaiter);
app.get("/waiter/:username", getWaiter);
app.patch("/waiter/:username", updateWaiter);
app.delete("/waiter/:username", deleteWaiter);
app.get("/", getEndpoints);
app.post("/payments", addPayment);

app.use((error, req, res, next) => {
  if (error.msg === "username exists") {
    res.status(400).send(error);
  } else if (error.msg === "details required not completed") {
    res.status(400).send(error);
  } else if (error.msg === "email exists") {
    res.status(400).send(error);
  }

  if (error.msg === "Not found") {
    res.status(404).send(error);
  }
});

module.exports = app;

const express = require("express");
const {
  addWaiter,
  getWaiter,
  updateWaiter,
} = require("./MVC/controllers/app.controllers");

const app = express();
app.use(express.json());

app.post("/waiter", addWaiter);
app.get("/waiter/:username", getWaiter);
app.patch("/waiter/:username", updateWaiter);

app.use((error, req, res, next) => {
  if (error.msg === "user exists") {
    res.status(400).send(error);
  } else if (error.msg === "details required not completed") {
    res.status(400).send(error);
  }

  if (error.msg === "Not found") {
    res.status(404).send(error);
  }
});

module.exports = app;

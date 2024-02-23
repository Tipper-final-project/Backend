const {
  postWaiter,
  fetchWaiter,
  patchWaiter,
  removeWaiter,
  fetchEndPoints,
  postPayment,
} = require("../models/app.models");

const addWaiter = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await postWaiter(data);
    res.status(201).send({});
  } catch (error) {
    next(error);
  }
};

const getWaiter = async (req, res, next) => {
  try {
    const username = req.params;
    const response = await fetchWaiter(username);
    res.status(200).send({ waiter: response });
  } catch (error) {
    next(error);
  }
};

const updateWaiter = async (req, res, next) => {
  try {
    const username = req.params;
    const newVal = req.body;
    const response = await patchWaiter(username, newVal);
    res.status(200).send({ waiter: response });
  } catch (error) {
    next(error);
  }
};

const deleteWaiter = async (req, res, next) => {
  try {
    const username = req.params;
    await removeWaiter(username);
    res.status(204).send({});
  } catch (error) {
    next(error);
  }
};

const getEndpoints = async (req, res, next) => {
  try {
    const endpoints = await fetchEndPoints();
    res.status(200).send({ endpoints });
  } catch (error) {
    next(error);
  }
};

const addPayment = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await postPayment(data);
    console.log(data);
    res.status(201).send({});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addWaiter,
  getWaiter,
  updateWaiter,
  deleteWaiter,
  getEndpoints,
  addPayment
};

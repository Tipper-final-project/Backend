const {
  postWaiter,
  fetchWaiter,
  patchWaiter,
} = require("../models/app.models");

const addWaiter = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await postWaiter(data);
    res.status(201).send({});
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getWaiter = async (req, res, next) => {
  try {
    const username = req.params;
    const response = await fetchWaiter(username);
    res.status(200).send({ waiter: response });
  } catch (error) {
    next(error);
    console.log(error);
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
    console.log(error);
  }
};

module.exports = { addWaiter, getWaiter, updateWaiter };

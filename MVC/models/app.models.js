const client = require("../../db/connection");
const db = client.db("test_db");
const waiters = db.collection("waiters");
const fs = require("fs/promises");

const postWaiter = async (data) => {
  try {
    const userExists = await waiters.findOne({ username: data.username });
    if (userExists) return Promise.reject({ msg: "username exists" });
    if (
      typeof data.username !== "string" ||
      typeof data.email !== "string" ||
      typeof data.bio !== "string" ||
      typeof data.workPlace !== "string"
    ) {
      return Promise.reject({ msg: "details required not completed" });
    }
    await waiters.insertOne(data);
  } catch (error) {
    console.log(error);
  }
};

const fetchWaiter = async (username) => {
  try {
    const response = await waiters.findOne(username);
    if (response === null) return Promise.reject({ msg: "Not found" });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const patchWaiter = async (username, newVal) => {
  try {
    const checkForUsername = await waiters.findOne(newVal);
    if (Object.keys(newVal).includes("username")) {
      if (checkForUsername !== null) {
        return Promise.reject({ msg: "username exists" });
      }
    }
    if (Object.keys(newVal).includes("email")) {
      if (checkForUsername !== null) {
        return Promise.reject({ msg: "email exists" });
      }
    }

    const update = { $set: newVal };

    const response = await waiters.findOneAndUpdate(username, update, {
      returnDocument: "after",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const removeWaiter = async (username) => {
  await waiters.findOneAndDelete(username);
  try {
  } catch (error) {}
};

const fetchEndPoints = async () => {
  try {
    const data = await fs.readFile(
      `${__dirname}/../../endpoints.json`,
      "utf-8"
    );
    return data;
  } catch (error) {}
};

module.exports = {
  postWaiter,
  fetchWaiter,
  patchWaiter,
  removeWaiter,
  fetchEndPoints,
};

const client = require("../../db/connection");
const dbString = process.env.NODE_ENV || "production";
const db = client.db(`${dbString}_db`);
const waiters = db.collection("waiters");
const payments = db.collection("payments");
const fs = require("fs/promises");

const postWaiter = async (data) => {
  try {
    const userExists = await waiters.findOne({ username: data.username });
    if (userExists) return Promise.reject({ msg: "username exists" });
    if (
      typeof data.username !== "string" ||
      typeof data.email !== "string" ||
      typeof data.bio !== "string" ||
      typeof data.workPlace !== "string" ||
      !data.hasOwnProperty("img_url") ||
      typeof data.firstName !== "string" ||
      typeof data.lastName !== "string"
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

const postPayment = async (data) => {
  try {
    await payments.insertOne(data);
  } catch (error) {
    console.log(error);
  }
};

const fetchPayment = async () => {
  try {
    const response = await payments.find({}).toArray();
    if (response === null) return Promise.reject({ msg: "Not found" });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const findUser = async (username) => {
  try {
    const response = await waiters.findOne({ username });
    if (response) return true;
    else return false;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postWaiter,
  fetchWaiter,
  patchWaiter,
  removeWaiter,
  fetchEndPoints,
  postPayment,
  fetchPayment,
  findUser,
};

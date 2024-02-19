const client = require("../../db/connection");
const db = client.db("test_db");
const waiters = db.collection("waiters");

const postWaiter = async (data) => {
  try {
    const userExists = await waiters.findOne({ username: data.username });
    if (userExists) return Promise.reject({ msg: "user exists" });
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
    const update = { $set: newVal };

    const response = await waiters.findOneAndUpdate(username, update, {
      returnDocument: "after",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postWaiter, fetchWaiter, patchWaiter };

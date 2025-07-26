import { getDB } from "../config/db.js";

export const getOnlyEmail = async (req, res) => {
  const db = getDB();
  const users = await db
    .collection("users")
    .find({}, { projection: { email: 1, _id: 0 } })
    .toArray();
  const emails = users.map((user) => user.email);
  res.send(emails);
};

export const createUser = async (req, res) => {
  const db = getDB();
  const user = req.body;
  const result = await db.collection("users").insertOne(user);
  res.status(201).json(result);
};

export const updateLastLogin = async (req, res) => {
  const db = getDB();
  const { email } = req.body;
  const result = await db.collection("users").updateOne(
    { email },
    {
      $set: { last_login: new Date().toISOString() },
    }
  );
  res.send(result);
};

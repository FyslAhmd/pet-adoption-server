import { getDB } from "../config/db.js";

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

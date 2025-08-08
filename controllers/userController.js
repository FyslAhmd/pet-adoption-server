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

export const getUserByEmail = async (req, res) => {
  const db = getDB();
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }
  const user = await db.collection("users").findOne({ email });
  res.status(200).send(user);
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

export const getUserRole = async (req, res) => {
  const db = getDB();
  const { email } = req.query;
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  res.send({ role: user.role });
};

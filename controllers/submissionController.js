import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const getSubmissionsByWorkerEmail = async (req, res) => {
  const db = getDB();
  const { email } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const query = { adopter_email: email };
    const totalSubmissions = await db.collection("pets").countDocuments(query);
    const totalPages = Math.ceil(totalSubmissions / limit);
    const adoptions = await db
      .collection("pets")
      .find(query)
      .sort({ adoption_requested_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    res.send({ adoptions, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch submissions" });
  }
};

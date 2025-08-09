import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const getAdopterDashboardStats = async (req, res) => {
  const email = req.query.email;
  const db = getDB();
  try {
    const totalSubmissions = await db
      .collection("pets")
      .countDocuments({ adopter_email: email });
    const pendingSubmissions = await db
      .collection("pets")
      .countDocuments({ adopter_email: email, status: "pending" });
    const favouritePetsCount = await db
      .collection("pets")
      .countDocuments({ favourites: email });
    res.send({
      totalSubmissions,
      pendingSubmissions,
      favouritePetsCount,
    });
  } catch (error) {
    console.error("Adopter dashboard error:", error);
    res.status(500).send({ error: "Failed to load dashboard data." });
  }
};

export const getApprovedSubmissions = async (req, res) => {
  const email = req.query.email;
  const db = getDB();
  try {
    const submissions = await db
      .collection("pets")
      .find({ adopter_email: email, status: "approved" })
      .toArray();
    res.send(submissions);
  } catch (error) {
    console.error("Fetch approved submissions error:", error);
    res.status(500).send({ error: "Failed to load submissions." });
  }
};

export const getRescuerDashboardStats = async (req, res) => {
  const db = getDB();
  const rescuerEmail = req.query.email;

  try {
    const pets = await db
      .collection("pets")
      .find({ rescuer_email: rescuerEmail })
      .toArray();
    const totalPets = pets.length;
    const availablePets = pets.filter(
      (pet) => pet.status === "available"
    ).length;
    const totalFavourites = pets.reduce(
      (sum, pet) => sum + (pet.favourites?.length || 0),
      0
    );
    res.send({
      totalPets,
      availablePets,
      totalFavourites,
    });
  } catch (err) {
    console.error("Rescuer dashboard error:", err);
    res.status(500).send({ error: "Failed to fetch rescuer stats" });
  }
};

export const getReviewSubmissions = async (req, res) => {
  const db = getDB();
  const rescuerEmail = req.query.email;
  const submissions = await db
    .collection("pets")
    .find({ rescuer_email: rescuerEmail, status: "pending" })
    .toArray();
  res.send(submissions);
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("users").find().toArray();
    const pets = await db.collection("pets").find().toArray();
    const totalAdopter = users.filter((u) => u.role === "adopter").length;
    const totalRescuer = users.filter((u) => u.role === "rescuer").length;
    const totalAdmin = users.filter((u) => u.role === "admin").length;
    const totalPets = pets.length;
    const availablePets = pets.filter(
      (pet) => pet.status === "available"
    ).length;
    res.send({
      totalAdopter,
      totalRescuer,
      totalAdmin,
      totalPets,
      availablePets,
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const approveSubmission = async (req, res) => {
  const { id } = req.params;
  const db = getDB();
  try {
    await db
      .collection("pets")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "approved" } });
    res.send({ message: "Submission approved" });
  } catch (err) {
    console.error("Error approving submission:", err);
    res.status(500).send({ error: "Failed to approve submission" });
  }
};

export const rejectSubmission = async (req, res) => {
  const db = getDB();
  const submissionId = req.params.id;
  try {
    await db.collection("pets").updateOne(
      { _id: new ObjectId(submissionId) },
      {
        $set: { status: "available" },
        $unset: { adopter_email: "", adoption_requested_at: "" },
      }
    );
    res.send({ message: "Submission rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Rejection failed" });
  }
};

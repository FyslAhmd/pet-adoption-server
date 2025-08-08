import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const getPetsByUser = async (req, res) => {
  const db = getDB();
  const pets = await db
    .collection("pets")
    .find({
      rescuer_email: req.query.rescuer_email,
    })
    .sort({ created_at: -1 })
    .toArray();
  res.send(pets);
};

export const createPet = async (req, res) => {
  const db = getDB();
  const {
    species,
    breed,
    age,
    gender,
    size,
    color,
    vaccinated,
    spayed_neutered,
    medical_notes,
    temperament_kids,
    temperament_pets,
    biography,
    location,
    coordinates,
    image,
    rescuer_name,
    rescuer_email,
    created_at,
    status,
  } = req.body;
  try {
    const userCollection = db.collection("users");
    const petCollection = db.collection("pets");
    const user = await userCollection.findOne({ email: rescuer_email });
    if (!user) {
      return res.status(404).json({ error: "Rescuer user not found." });
    }
    const petDoc = {
      species,
      breed,
      age,
      gender,
      size,
      color,
      vaccinated,
      spayed_neutered,
      medical_notes,
      temperament_kids,
      temperament_pets,
      biography,
      location,
      coordinates,
      image,
      rescuer_name,
      rescuer_email,
      created_at,
      status: status || "available",
    };
    const petResult = await petCollection.insertOne(petDoc);
    res.status(201).send(petResult);
  } catch (error) {
    console.error("Error in createPet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePet = async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const updates = req.body;
  const result = await db
    .collection("pets")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
  res.send(result);
};

export const deletePet = async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const deleteResult = await db
    .collection("pets")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(deleteResult);
};

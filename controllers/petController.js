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

export const getAllPets = async (req, res) => {
  const db = getDB();
  const pets = await db.collection("pets").find().toArray();
  res.send(pets);
};

export const getAvailablePets = async (req, res) => {
  const db = getDB();
  const pets = await db
    .collection("pets")
    .find({ status: "available" })
    .sort({ created_at: -1 })
    .toArray();
  res.send(pets);
};

export const getFavouritePets = async (req, res) => {
  const db = getDB();
  const petsCollection = db.collection("pets");
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const favouritePets = await petsCollection
      .find({ favourites: email })
      .toArray();
    res.send(favouritePets);
  } catch (error) {
    console.error("Error fetching favourite pets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPetById = async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const pet = await db.collection("pets").findOne({ _id: new ObjectId(id) });
  res.send(pet);
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

export const updateStatusPending = async (req, res) => {
  try {
    const db = getDB();
    const petsCollection = db.collection("pets");
    const { id } = req.params;
    const { adopterEmail } = req.body;
    console.log(id, adopterEmail);
    const result = await petsCollection.updateOne(
      { _id: new ObjectId(id), status: "available" },
      {
        $set: {
          status: "pending",
          adopter_email: adopterEmail,
          adoption_requested_at: new Date(),
        },
      }
    );
    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Pet not found or already pending/adopted" });
    }
    res.json({ message: "Pet status updated to pending", adopterEmail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateFavourite = async (req, res) => {
  const db = getDB();
  const petsCollection = db.collection("pets");
  const { id } = req.params;
  const { userEmail } = req.body;
  if (!userEmail) {
    return res.status(400).json({ message: "User email is required" });
  }
  try {
    const pet = await petsCollection.findOne({ _id: new ObjectId(id) });
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    const favourites = Array.isArray(pet.favourites) ? pet.favourites : [];
    let updatedFavourites;
    if (favourites.includes(userEmail)) {
      updatedFavourites = favourites.filter((email) => email !== userEmail);
    } else {
      updatedFavourites = [...favourites, userEmail];
    }
    await petsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { favourites: updatedFavourites } }
    );
    const updatedPet = await petsCollection.findOne({ _id: new ObjectId(id) });
    res.json({
      message: favourites.includes(userEmail)
        ? "Removed from favourites"
        : "Added to favourites",
      pet: updatedPet,
    });
  } catch (error) {
    console.error("Error updating favourites:", error);
    res.status(500).json({ message: "Server error" });
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

import express from "express";
import {
  createPet,
  deletePet,
  getAvailablePets,
  getPetById,
  getPetsByUser,
  updatePet,
  updateStatusPending,
} from "../controllers/petController.js";

const router = express.Router();

router.get("/", getPetsByUser);
router.get("/available", getAvailablePets);
router.get("/:id", getPetById);
router.post("/", createPet);
router.patch("/adopt/:id", updateStatusPending);
router.patch("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;

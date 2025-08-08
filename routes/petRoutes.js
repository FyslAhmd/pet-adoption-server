import express from "express";
import { createPet, deletePet, getPetsByUser, updatePet } from "../controllers/petController.js";

const router = express.Router();

router.get("/", getPetsByUser);
router.post("/", createPet);
router.patch("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;

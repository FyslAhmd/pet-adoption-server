import express from "express";
import { createPet } from "../controllers/petController.js";

const router = express.Router();

router.post("/", createPet);

export default router;

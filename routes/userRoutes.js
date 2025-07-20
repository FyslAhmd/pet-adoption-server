import express from "express";
import { createUser, updateLastLogin } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.patch("/last-login", updateLastLogin);

export default router;

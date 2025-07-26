import express from "express";
import { createUser, getOnlyEmail, updateLastLogin } from "../controllers/userController.js";

const router = express.Router();

router.get("/getOnlyEmail", getOnlyEmail);
router.post("/", createUser);
router.patch("/last-login", updateLastLogin);

export default router;

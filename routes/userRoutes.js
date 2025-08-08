import express from "express";
import {
  createUser,
  getOnlyEmail,
  getUserByEmail,
  getUserRole,
  updateLastLogin,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/byEmail", getUserByEmail);
router.get("/role", getUserRole);
router.get("/getOnlyEmail", getOnlyEmail);
router.post("/", createUser);
router.patch("/last-login", updateLastLogin);

export default router;

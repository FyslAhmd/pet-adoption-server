import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getOnlyEmail,
  getUserByEmail,
  getUserRole,
  updateLastLogin,
  updateUserRole,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/byEmail", getUserByEmail);
router.get("/role", getUserRole);
router.get("/getOnlyEmail", getOnlyEmail);
router.get("/", getAllUsers);
router.post("/", createUser);
router.patch("/last-login", updateLastLogin);
router.patch("/role/:email", updateUserRole);
router.delete("/:email", deleteUser);

export default router;

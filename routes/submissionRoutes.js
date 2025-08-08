import express from "express";
import { getSubmissionsByWorkerEmail } from "../controllers/submissionController.js";

const router = express.Router();

router.get("/:email", getSubmissionsByWorkerEmail);

export default router;

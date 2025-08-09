import express from "express";
import {
  approveSubmission,
  getAdminDashboardStats,
  getAdopterDashboardStats,
  getApprovedSubmissions,
  getRescuerDashboardStats,
  getReviewSubmissions,
  rejectSubmission,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/adopter-stats", getAdopterDashboardStats);
router.get("/approved-submissions", getApprovedSubmissions);
router.get("/rescuer-stats", getRescuerDashboardStats);
router.get("/review-submissions", getReviewSubmissions);
router.get("/admin-stats", getAdminDashboardStats);
router.patch("/approve-submission/:id", approveSubmission);
router.patch("/reject-submission/:id", rejectSubmission);

export default router;

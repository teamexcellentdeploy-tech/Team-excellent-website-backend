import express from "express";
import {
    createCareer,
    getAllCareers,
    getActiveCareers,
    getCareerById,
    updateCareer,
    deleteCareer,
    toggleActiveStatus
} from "../Controllers/careerController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getActiveCareers);
router.get("/:id", getCareerById);

// Admin routes (protected)
router.post("/", authMiddleware(["admin"]), createCareer);
router.get("/all/admin", authMiddleware(["admin"]), getAllCareers);
router.put("/:id", authMiddleware(["admin"]), updateCareer);
router.delete("/:id", authMiddleware(["admin"]), deleteCareer);
router.patch("/:id/status", authMiddleware(["admin"]), toggleActiveStatus);

export default router;

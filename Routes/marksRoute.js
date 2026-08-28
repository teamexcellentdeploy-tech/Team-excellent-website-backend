import express from "express";
import { addMarks, getAllMarks, deleteMarks, updateMarks, getStudentMarks } from "../Controllers/marksController.js";
import authMiddleware from "../Middleware/auth.js";
const router = express.Router();

router.post("/addMarks", authMiddleware(["admin"]), addMarks);
router.get("/getAllMarks", authMiddleware(["admin"]), getAllMarks);
router.post("/getStudentMarks", getStudentMarks);   
router.delete("/deleteMarks/:id", authMiddleware(["admin"]), deleteMarks);
router.put("/updateMarks/:id", authMiddleware(["admin"]), updateMarks);

export default router;
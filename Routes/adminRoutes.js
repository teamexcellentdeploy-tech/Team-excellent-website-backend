import express from "express";
import { registerAdmin, loginAdmin} from "../Controllers/adminController.js";
import authMiddleware from "../Middleware/auth.js";
const router = express.Router();

router.post("/registerAdmin", authMiddleware(["admin"]), registerAdmin);    
router.post("/loginAdmin", loginAdmin);

export default router;
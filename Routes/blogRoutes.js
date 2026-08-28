import express from "express";
import {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getPublishedBlogs,
    getBlogByPermalink,
    getBlogById,
    togglePublishStatus
} from "../Controllers/blogController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/published", getPublishedBlogs);
router.get("/permalink/:permalink", getBlogByPermalink);

// Admin routes (protected)
router.post("/", authMiddleware(["admin"]), createBlog);
router.put("/:id", authMiddleware(["admin"]), updateBlog);
router.delete("/:id", authMiddleware(["admin"]), deleteBlog);
router.get("/all", authMiddleware(["admin"]), getAllBlogs);
router.get("/:id", authMiddleware(["admin"]), getBlogById);
router.patch("/:id/publish", authMiddleware(["admin"]), togglePublishStatus);

export default router;

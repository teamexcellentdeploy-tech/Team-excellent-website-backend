import express from 'express';
import { 
    getApprovedReviews, 
    getAllReviews, 
    createReview, 
    deleteReview, 
    toggleReviewApproval 
} from '../Controllers/reviewController.js';
import authMiddleware from '../Middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getApprovedReviews);
router.post('/', createReview); // Allow users to submit reviews (default isApproved can be handled in logic)

// Admin routes (Protected)
router.get('/admin', authMiddleware(['admin']), getAllReviews);
router.put('/:id/toggle-approval', authMiddleware(['admin']), toggleReviewApproval);
router.delete('/:id', authMiddleware(['admin']), deleteReview);

export default router;

import express from 'express';
import { createCounseling, getCounselings, deleteCounseling, updateCounselingStatus } from '../Controllers/counselingController.js';
import authMiddleware from '../Middleware/auth.js';

const router = express.Router();

// Public route to submit counseling request
router.post('/', createCounseling);

// Protected routes for admin
router.get('/', authMiddleware(['admin']), getCounselings);
router.delete('/:id', authMiddleware(['admin']), deleteCounseling);
router.patch('/:id', authMiddleware(['admin']), updateCounselingStatus);

export default router;

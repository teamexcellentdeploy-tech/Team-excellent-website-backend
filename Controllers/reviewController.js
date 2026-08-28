import Review from '../Models/reviewModel.js';

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
export const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all reviews for admin
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public (or Admin only if restricted)
export const createReview = async (req, res) => {
    try {
        const { name, review, rating, studentRole } = req.body;
        const newReview = await Review.create({ name, review, rating, studentRole });
        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update review approval status
// @route   PUT /api/reviews/:id
// @access  Private/Admin
export const toggleReviewApproval = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        review.isApproved = !review.isApproved;
        await review.save();
        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

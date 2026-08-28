import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    review: {
        type: String,
        required: [true, 'Review content is required'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    date: {
        type: String,
        default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    isApproved: {
        type: Boolean,
        default: true // Admins can later moderate this if needed
    },
    studentRole: {
        type: String,
        default: 'Student'
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

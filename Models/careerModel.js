import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        required: true,
        default: 'Patna, Bihar'
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    experience: {
        type: String,
        default: 'Fresher'
    },
    salary: {
        type: String,
        default: 'Not Disclosed'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for filtering active jobs
careerSchema.index({ isActive: 1, datePosted: -1 });

const Career = mongoose.model('Career', careerSchema);

export default Career;

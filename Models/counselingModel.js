import mongoose from 'mongoose';

const counselingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]{3,50}$/.test(v);
            },
            message: props => `${props.value} is not a valid name! Name should contain only letters and be 3-50 characters long.`
        }
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    targetExam: {
        type: String,
        required: [true, 'Target exam is required'],
        trim: true
    },
    status: {
        type: String,
        default: 'Pending',
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

const Counseling = mongoose.model('Counseling', counselingSchema);
export default Counseling;

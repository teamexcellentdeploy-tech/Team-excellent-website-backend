import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
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
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                // Email is optional, so return true if empty
                if (!v) return true;
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    course: {
        type: String,
        required: [true, 'Course selection is required']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]{2,50}$/.test(v);
            },
            message: props => `${props.value} is not a valid city name!`
        }
    },
    query: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'Pending',
        trim: true
    }
}, {
    timestamps: true
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;

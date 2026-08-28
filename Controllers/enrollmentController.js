import Enrollment from "../Models/enrollmentModel.js";

// @desc    Submit a new enrollment
// @route   POST /api/enrollments
// @access  Public
export const createEnrollment = async (req, res) => {
    try {
        const { fullName, mobileNumber, email, course, city, query } = req.body;

        // Validation patterns
        const nameRegex = /^[a-zA-Z\s]{3,50}$/;
        const mobileRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const cityRegex = /^[a-zA-Z\s]{2,50}$/;

        // Basic validation
        if (!fullName || !mobileNumber || !course || !city) {
            return res.status(400).json({ message: 'Please fill all required fields (Name, Mobile, Course, City)' });
        }

        if (!nameRegex.test(fullName)) {
            return res.status(400).json({ message: 'Invalid name. Use only letters (3-50 chars).' });
        }

        if (!mobileRegex.test(mobileNumber)) {
            return res.status(400).json({ message: 'Invalid mobile number. Must be a 10-digit number.' });
        }

        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address format.' });
        }

        if (!cityRegex.test(city)) {
            return res.status(400).json({ message: 'Invalid city name.' });
        }

        const enrollment = new Enrollment({
            fullName,
            mobileNumber,
            email,
            course,
            city,
            query
        });

        const savedEnrollment = await enrollment.save();
        res.status(201).json({
            message: 'Enrollment submitted successfully',
            enrollment: savedEnrollment
        });
    } catch (error) {
        console.error('Create enrollment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private/Admin
export const getEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().sort({ createdAt: -1 });
        res.status(200).json({ enrollments });
    } catch (error) {
        console.error('Get enrollments error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete an enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
export const deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        console.error('Delete enrollment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update an enrollment status
// @route   PATCH /api/enrollments/:id/status
// @access  Private/Admin
export const updateEnrollmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', enrollment });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

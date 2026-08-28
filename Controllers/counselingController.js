import Counseling from '../Models/counselingModel.js';

// @desc    Submit a new counseling request
// @route   POST /api/counseling
// @access  Public
export const createCounseling = async (req, res) => {
    try {
        const { fullName, contactNumber, targetExam } = req.body;
        
        if (!fullName || !contactNumber || !targetExam) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newRequest = new Counseling({
            fullName,
            contactNumber,
            targetExam
        });

        await newRequest.save();
        res.status(201).json({ message: 'Counseling request submitted successfully', data: newRequest });
    } catch (error) {
        console.error('Create counseling request error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all counseling requests
// @route   GET /api/counseling
// @access  Private/Admin
export const getCounselings = async (req, res) => {
    try {
        const requests = await Counseling.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        console.error('Get counseling requests error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a counseling request
// @route   DELETE /api/counseling/:id
// @access  Private/Admin
export const deleteCounseling = async (req, res) => {
    try {
        const request = await Counseling.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Counseling request not found' });
        }
        res.status(200).json({ message: 'Counseling request deleted successfully' });
    } catch (error) {
        console.error('Delete counseling request error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update counseling request status or notes
// @route   PATCH /api/counseling/:id
// @access  Private/Admin
export const updateCounselingStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const updateData = {};
        
        if (status !== undefined) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const request = await Counseling.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: 'Counseling request not found' });
        }

        res.status(200).json({ message: 'Counseling request updated successfully', data: request });
    } catch (error) {
        console.error('Update counseling request error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

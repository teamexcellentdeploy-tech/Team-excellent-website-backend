import Career from "../Models/careerModel.js";

// @desc    Create a new career posting
// @route   POST /api/careers
// @access  Private (Admin)
export const createCareer = async (req, res) => {
    try {
        const { title, description, requirements, location, jobType, experience, salary, isActive } = req.body;

        const career = new Career({
            title,
            description,
            requirements,
            location,
            jobType,
            experience,
            salary,
            isActive
        });

        const createdCareer = await career.save();
        res.status(201).json(createdCareer);
    } catch (error) {
        console.error("Error creating career:", error);
        res.status(500).json({ message: "Failed to create career", error: error.message });
    }
};

// @desc    Get all careers (admin)
// @route   GET /api/careers/all
// @access  Private (Admin)
export const getAllCareers = async (req, res) => {
    try {
        const careers = await Career.find({}).sort({ datePosted: -1 });
        res.json(careers);
    } catch (error) {
        console.error("Error fetching all careers:", error);
        res.status(500).json({ message: "Failed to fetch careers", error: error.message });
    }
};

// @desc    Get all active careers (public)
// @route   GET /api/careers
// @access  Public
export const getActiveCareers = async (req, res) => {
    try {
        const careers = await Career.find({ isActive: true }).sort({ datePosted: -1 });
        res.json(careers);
    } catch (error) {
        console.error("Error fetching active careers:", error);
        res.status(500).json({ message: "Failed to fetch active careers", error: error.message });
    }
};

// @desc    Get career by ID
// @route   GET /api/careers/:id
// @access  Public
export const getCareerById = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (career) {
            res.json(career);
        } else {
            res.status(404).json({ message: "Career not found" });
        }
    } catch (error) {
        console.error("Error fetching career:", error);
        res.status(500).json({ message: "Failed to fetch career", error: error.message });
    }
};

// @desc    Update a career
// @route   PUT /api/careers/:id
// @access  Private (Admin)
export const updateCareer = async (req, res) => {
    try {
        const { title, description, requirements, location, jobType, experience, salary, isActive } = req.body;

        const career = await Career.findById(req.params.id);

        if (career) {
            career.title = title || career.title;
            career.description = description || career.description;
            career.requirements = requirements !== undefined ? requirements : career.requirements;
            career.location = location || career.location;
            career.jobType = jobType || career.jobType;
            career.experience = experience || career.experience;
            career.salary = salary || career.salary;
            career.isActive = isActive !== undefined ? isActive : career.isActive;

            const updatedCareer = await career.save();
            res.json(updatedCareer);
        } else {
            res.status(404).json({ message: "Career not found" });
        }
    } catch (error) {
        console.error("Error updating career:", error);
        res.status(500).json({ message: "Failed to update career", error: error.message });
    }
};

// @desc    Delete a career
// @route   DELETE /api/careers/:id
// @access  Private (Admin)
export const deleteCareer = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);

        if (career) {
            await career.deleteOne();
            res.json({ message: "Career removed" });
        } else {
            res.status(404).json({ message: "Career not found" });
        }
    } catch (error) {
        console.error("Error deleting career:", error);
        res.status(500).json({ message: "Failed to delete career", error: error.message });
    }
};

// @desc    Toggle career active status
// @route   PATCH /api/careers/:id/status
// @access  Private (Admin)
export const toggleActiveStatus = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);

        if (career) {
            career.isActive = !career.isActive;
            const updatedCareer = await career.save();
            res.json(updatedCareer);
        } else {
            res.status(404).json({ message: "Career not found" });
        }
    } catch (error) {
        console.error("Error toggling status:", error);
        res.status(500).json({ message: "Failed to toggle status", error: error.message });
    }
};

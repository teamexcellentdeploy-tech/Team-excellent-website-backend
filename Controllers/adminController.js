import adminSchema from "../Models/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();    
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
// Admin Registration
export const registerAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Check if admin already exists
        const existingAdmin = await adminSchema.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        // Create new admin
        const newAdmin = new adminSchema({ email, password: hashedPassword, role});
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Check if JWT_SECRET is set
        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        
        // Find admin by email
        const admin = await adminSchema.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Create JWT token and include role in the payload
        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
import express from 'express';
import multer from 'multer';
import cloudinary from '../Config/cloudinary.js';
import authMiddleware from '../Middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage (buffer)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Upload image to Cloudinary (Admin only)
router.post('/image', authMiddleware(), upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Upload to Cloudinary using stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'teamexcellent/blogs',
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({
                        message: 'Failed to upload image to cloud',
                        error: error.message
                    });
                }

                res.status(200).json({
                    message: 'Image uploaded successfully',
                    url: result.secure_url,
                    public_id: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height
                });
            }
        );

        // Pipe the file buffer to the upload stream
        uploadStream.end(req.file.buffer);

    } catch (error) {
        console.error('Upload route error:', error);
        res.status(500).json({
            message: 'Server error during upload',
            error: error.message
        });
    }
});

// Delete image from Cloudinary (Admin only)
// Note: Frontend needs to send public_id, or we extract it from URL
router.delete('/image', authMiddleware(), async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ message: 'Public ID is required' });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result !== 'ok') {
            return res.status(500).json({ message: 'Failed to delete image', result });
        }

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            message: 'Failed to delete image',
            error: error.message
        });
    }
});

export default router;

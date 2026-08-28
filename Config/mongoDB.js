import mongoose from 'mongoose';

const mongoDB = async () => {
    // If already connected, use that connection
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    mongoose.connection.on('connected', () => {
        console.log('MongoDB Connected Successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        });
    } catch (error) {
        console.error('Initial MongoDB connection error:', error);
        throw error;
    }
}


export default mongoDB;
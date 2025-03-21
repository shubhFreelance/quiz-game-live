import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} - Resolves when the connection is successful.
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
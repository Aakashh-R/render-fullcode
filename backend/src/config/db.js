import mongoose from "mongoose";
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set; skipping MongoDB connection (development only)');
    return;
  }

  try {
    // Use default mongoose options (v6+ handles modern connection options)
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // In production we want to fail fast; in development avoid exiting the process
    // if (process.env.NODE_ENV === 'production') {
    //   process.exit(1);
    // }
  }
};
export default connectDB;
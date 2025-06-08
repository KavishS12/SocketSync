import mongo from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongo.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully : ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
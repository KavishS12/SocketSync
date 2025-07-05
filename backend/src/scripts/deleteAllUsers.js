import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import { connectDB } from '../lib/db.js';

dotenv.config();

const deleteAllUsers = async () => {
  try {
    await connectDB();

    // Delete all users
    const result = await User.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} users from the database`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error deleting users:', error);
    process.exit(1);
  }
};

// Run the script
deleteAllUsers(); 
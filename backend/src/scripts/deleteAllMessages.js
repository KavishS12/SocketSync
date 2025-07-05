import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from '../models/messageModel.js';
import { connectDB } from '../lib/db.js';

// Load environment variables
dotenv.config();

const deleteAllMessages = async () => {
  try {
    await connectDB();

    // Delete all messages
    const result = await Message.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} messages from the database`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error deleting messages:', error);
    process.exit(1);
  }
};

// Run the script
deleteAllMessages(); 
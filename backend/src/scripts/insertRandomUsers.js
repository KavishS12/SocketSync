import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import { connectDB } from '../lib/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const randomNames = [
  { firstName: 'John', lastName: 'Smith', profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { firstName: 'Emma', lastName: 'Johnson', profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
  { firstName: 'Michael', lastName: 'Williams', profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  { firstName: 'Sarah', lastName: 'Brown', profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  { firstName: 'David', lastName: 'Jones', profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { firstName: 'Lisa', lastName: 'Garcia', profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
  { firstName: 'James', lastName: 'Miller', profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
  { firstName: 'Jennifer', lastName: 'Davis', profilePic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face' }
];

const insertRandomUsers = async () => {
  try {
    await connectDB();

    // Generate the emails that will be used
    const emailsToInsert = randomNames.map(name => 
      `${name.firstName.toLowerCase()}${name.lastName.toLowerCase()}@gmail.com`
    );

    // Delete existing users with the same emails
    const deleteResult = await User.deleteMany({ email: { $in: emailsToInsert } });
    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} existing users with conflicting emails`);
    }

    const users = [];

    for (const name of randomNames) {
      const email = `${name.firstName.toLowerCase()}${name.lastName.toLowerCase()}@gmail.com`;
      const password = `${name.firstName.toLowerCase()}@123`;
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      users.push({
        name: `${name.firstName} ${name.lastName}`,
        email: email,
        password: hashedPassword,
        profilePic: name.profilePic
      });
    }

    // Insert all users
    const result = await User.insertMany(users);
    
    console.log(`Successfully inserted ${result.length} users:`);
    
    // Display the created users with their credentials
    result.forEach(user => {
      const firstName = user.name.split(' ')[0].toLowerCase();
      console.log(`- ${user.name} (${user.email}) - Password: ${firstName}@123`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error inserting users:', error);
    process.exit(1);
  }
};

// Run the script
insertRandomUsers(); 
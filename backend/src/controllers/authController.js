import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  const {name, email, password} = req.body;
  try {
    if(!name || !email || !password) {
      return res.status(400).json({message: "Please fill all the fields"});
    }
    
    if(password.length < 6) {
      return res.status(400).json({message: "Password must be at least 6 characters long"});
    }

    const user = await User.findOne({ email });
    if(user) {
      return res.status(400).json({message: "User with this email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password:hashedPassword
    })

    if(newUser){
        //generate jwt token
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic,
            }
        });
    } else {
      return res.status(400).json({message: "Invalid user data"});
    }
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({message: "Internal server error"});
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
        message: "Logged in successful",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
        }
    });

  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic) {
      return res.status(400).json({message: "Please provide a profile pic"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error during profile update:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({
            message: "User is authenticated",
            user: req.user
        });
    }  catch (error) {
        console.error("Error in checkAuth:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
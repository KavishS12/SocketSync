import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getMessages = async (req, res) => {

  try {
    const { id:userToChatId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
        $or : [
            {senderId: userId, receiverId: userToChatId},
            {senderId: userToChatId, receiverId: userId}
        ]
    })

    res.status(200).json(messages);
   
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const sendMessage = async (req,res) => {
    try {
        const {text, image} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let ImageUrl;
        if(image) {
            const uploadImage = await cloudinary.uploader.upload(image);
            ImageUrl =  uploadImage.secure_url;
        }
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: ImageUrl
        });

        await newMessage.save();
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        // Optionally, emit a socket event here to notify the receiver about the new message

        res.status(201).json(newMessage)

    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only edit your own messages" });
        }

        // Check if message is within 1 minute of creation
        const messageAge = Date.now() - new Date(message.createdAt).getTime();
        const oneMinute = 60 * 1000; // 1 minute in milliseconds

        if (messageAge > oneMinute) {
            return res.status(400).json({ 
                message: "Messages can only be edited within 1 minute of sending",
                timeLimit: "1 minute"
            });
        }

        if (message.isDeleted) {
            return res.status(400).json({ message: "Cannot edit a deleted message" });
        }

        // Store original text if this is the first edit
        if (!message.isEdited) {
            message.originalText = message.text;
        }

        message.text = text;
        message.isEdited = true;
        await message.save();

        // Emit socket event to update message in real-time
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageEdited', message);
        }

        res.status(200).json(message);

    } catch (error) {
        console.error("Error editing message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        // Check if message is within 5 minutes of creation
        const messageAge = Date.now() - new Date(message.createdAt).getTime();
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (messageAge > fiveMinutes) {
            return res.status(400).json({ 
                message: "Messages can only be deleted within 5 minutes of sending",
                timeLimit: "5 minutes"
            });
        }

        message.isDeleted = true;
        message.text = "This message was deleted";
        await message.save();

        // Emit socket event to update message in real-time
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageDeleted', message);
        }

        res.status(200).json(message);

    } catch (error) {
        console.error("Error deleting message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
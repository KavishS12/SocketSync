import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

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
        
        // real-time functionality to be implemented here using socket.io
        // Optionally, emit a socket event here to notify the receiver about the new message

        res.status(201).json(newMessage)

    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
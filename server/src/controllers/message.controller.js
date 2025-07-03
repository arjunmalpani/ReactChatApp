import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getRecieverSocketId, io } from '../lib/socket.js';

export const getUsers = async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.log("Error in getUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export const getMessages = async (req, res, next) => {
    try {

        const { id: chatUserId } = req.params;

        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: chatUserId },
                { senderId: chatUserId, receiverId: loggedInUserId },
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessages = async (req, res, next) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required" });
        }
        let imageUrl = null;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        const receiverSocketId = getRecieverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }
        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
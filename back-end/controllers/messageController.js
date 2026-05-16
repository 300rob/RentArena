const User = require('../models/User')
const Message = require('../models/Message')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const { getReceiverSocketId } = require('../utils/socket')
const { io } = require('../utils/socket')
const getUserForSidebar = async (req, res) => {
    const loggedInUserId = req.user.userId;
    console.log(loggedInUserId)
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')
    res.status(StatusCodes.OK).json(filteredUsers)
}
const getMessages = async (req, res) => {
    const { id: userToChatId } = req.params
    const myId = req.user.userId;
    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId }
        ]
    })
    res.status(StatusCodes.OK).json(messages)
}
const sendMessages = async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    if(!text && !image) {
        throw new CustomError.BadRequestError('Message must contain text or image')
    }
    
    if(text && text.length > 5000) {
        throw new CustomError.BadRequestError('Message text is too long')
    }
    
    if(!receiverId || receiverId.length !== 24) {
        throw new CustomError.BadRequestError('Invalid receiver ID')
    }

    console.log("sendeerId:", senderId)
    let imageUrl;
    if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(StatusCodes.CREATED).json(newMessage)
}
module.exports = {
    getUserForSidebar,
    getMessages,
    sendMessages
}
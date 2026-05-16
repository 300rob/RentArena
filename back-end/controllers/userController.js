const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')
const showCurrentUser = async(req, res) => {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid!');
    }
    const tokenUser = {
        name: user.name,
        userId: user._id,
        role: user.role,
        email: user.email,
        verifiedAt: user.verifiedAt,
        profilePic: user.profilePic
    };
    res.status(StatusCodes.OK).json({user: tokenUser})
}
const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).select('-password')
    if(!user) {
        throw new CustomError.BadRequestError('No user with this id')
    }
    res.status(StatusCodes.OK).json({user})

} 
const updateUser = async(req, res) => {
    res.send('update user controller')
}
const updateUserPassword = async(req,res) => {
    res.send('update user password controller')
} 
const getAllUsers = async(req,res) => {
    const users = await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.CREATED).json({users})
}
const updateProfile = async(req,res) => {
    const {profilePic} = req.body;
    const userId = req.user.userId;
    
    if(!profilePic) {
        throw new CustomError.BadRequestError('Profile pic is required');
    }
    
    if(!profilePic.startsWith('data:image/')) {
        throw new CustomError.BadRequestError('Invalid image format');
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})
    res.status(StatusCodes.CREATED).json({updatedUser})
}
const getUser = async(req,res) => {
    const {id} = req.params;
    
    if(!id) {
        throw new CustomError.BadRequestError('No id match');
    }
    
    if(id.length !== 24) {
        throw new CustomError.BadRequestError('Invalid user ID format');
    }

    const user = await User.findById(id).select('-password')
    if(!user) {
        throw new CustomError.BadRequestError('User not found');
    }
    
    res.status(StatusCodes.OK).json({user})
}


module.exports = {
    showCurrentUser,
    getSingleUser,
    updateUser,
    updateUserPassword,
    getAllUsers,
    updateProfile,
    getUser
}



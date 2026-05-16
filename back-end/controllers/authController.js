const User = require('../models/User')
const Token = require('../models/Token')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse, sendVerificationEmail, sendResetPasswordEmail,createHash} = require('../utils')
const crypto = require('crypto')

const register = async (req,res) => {
    const {email,name, password} = req.body

    if(!name || !email || !password) {
        throw new CustomError.BadRequestError('Please provide all values')
    }
    if(name.length < 3 || name.length > 20) {
        throw new CustomError.BadRequestError('Name must be between 3 and 20 characters')
    }
    if(password.length < 8) {
        throw new CustomError.BadRequestError('Password must be at least 8 characters')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        throw new CustomError.BadRequestError('Please provide a valid email')
    }

    const emailAlreadyExists = await User.findOne({email})
    if(emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists') 
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({name,email,password, role, verificationToken})
    const origin = process.env.FRONTEND_URL || 'http://localhost:5173';
    await sendVerificationEmail({name: user.name, email: user.email, verificationToken: user.verificationToken, origin});
            
    res.status(StatusCodes.CREATED).json({
        msg: "Success! Please check your email to verify your account!", 
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            userId: user._id
        },
        success: true,
    })
}

const login = async (req,res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        throw new CustomError.BadRequestError('Please provide a valid email')
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
  
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    if(!user.isVerified) {
        throw new CustomError.UnauthenticatedError('Please verify your email')
    }

    const tokenUser = {name: user.name, userId: user._id, role:user.role, email: user.email, verifiedAt: user.verifiedAt, profilePic: user.profilePic}

    let refreshToken = '';
    const existingToken = await Token.findOne({user: user._id})

    if(existingToken) {
        const {isValid} = existingToken
        if(!isValid){
            throw new CustomError.UnauthenticatedError("Invalid credentials")
        }
        refreshToken = existingToken.refreshToken
        attachCookiesToResponse({res, user: tokenUser, refreshToken})
        res.status(StatusCodes.CREATED).json({msg:"Success! Your are now logged in!",tokenUser,
            success: true,
        })
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = {refreshToken, ip, userAgent, user: user._id}

    await Token.create(userToken);
    attachCookiesToResponse({res, user: tokenUser, refreshToken})

    res.status(StatusCodes.CREATED).json({msg:"Success! Your are now logged in!",
        user: tokenUser,
        success: true,
    })
}

const logout = async (req,res) => {
    await Token.findOneAndDelete({user: req.user.userId}) 

    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg: 'logged out'}) 
};

const verifyEmail = async (req,res) => {
    const {verificationToken, email} = req.body;
    const user = await User.findOne({email})
    if(!user) {
        throw new CustomError.BadRequestError("Verification failed!")
    }
    if(user.verificationToken.trim() !== verificationToken.trim() ){
        throw new CustomError.BadRequestError("Verification failed!")
    }

    user.isVerified = true;
    user.verifiedAt = new Date()
    user.verificationToken = ''

    await user.save()

    res.status(StatusCodes.OK).json({msg:'Email is now verified!'})
}

const forgotPassword = async(req,res) => {
    const {email} = req.body

    if(!email) {
        throw new CustomError.BadRequestError('Please provide valid email')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        throw new CustomError.BadRequestError('Please provide a valid email')
    }

    const user = await User.findOne({email})
    if(user) {
        const passwordToken = crypto.randomBytes(70).toString('hex');
        const origin = process.env.FRONTEND_URL || 'http://localhost:5173';
        await sendResetPasswordEmail({name: user.name, email: user.email,token: passwordToken, origin})
        const passwordTokenExpirationDate = new Date(Date.now() + (1000 * 60 * 10))
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save() 
    }
    res.status(StatusCodes.OK).json({msg:'Please check your email for reset password link'})
}

const resetPassword = async(req,res) => {
    const {token,email,password } = req.body;
    if(!token || !email || !password) {
        throw new CustomError.BadRequestError("Please provide all values")
    }
    const user = await User.findOne({email})
    if(user){
        const currentDate = new Date()
        if(user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate){
            user.password = password
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
        }
        await user.save()
    }
    res.status(StatusCodes.OK).json({msg:"Your password is changed"})
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}

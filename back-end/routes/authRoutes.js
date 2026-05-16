const express = require("express")
const router = express.Router()
const rateLimit = require('express-rate-limit');

const {login, register, logout, verifyEmail,resetPassword,forgotPassword} = require('../controllers/authController')
const {authenticateUser} = require('../middleware/authentication')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', limiter, register)
router.post('/login', limiter, login)
router.delete('/logout',authenticateUser,logout)
router.post('/verify-email', limiter, verifyEmail)
router.post('/reset-password', limiter, resetPassword)
router.post('/forgot-password', limiter, forgotPassword)

module.exports = router
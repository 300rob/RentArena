const {createJWT, isTokenValid, attachCookiesToResponse} = require('./jwt')
const sendVerificationEmail = require('./sendVerificationEmail')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const createHash = require('./createHash')
module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,
}
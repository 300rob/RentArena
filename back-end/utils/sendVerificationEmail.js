const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({name,email,verificationToken,origin}) => {

    const verifiyEmail= `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<p>Please confirm the email by clicking on the following link: <a href="${verifiyEmail}">Verify Email</a></p>`

    return sendEmail({to:email,
        subject:'Email Confirmation', 
        html:`<h4>Hello, ${name}</h4>
        ${message} 
        `
    })
}

module.exports = sendVerificationEmail
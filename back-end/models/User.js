const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 20,
        minlength: 3,
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        }
    },
        password:{
        type: String,
        required: [true, 'Please provide passsword'],
    },
        profilePic: {
            type: String,
            default: "",
        },
    role: {
        type: String,
        enum: ['admin', 'owner', 'user'],
        default: 'user',
    },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifiedAt: {
        type: Date,
    },
    passwordToken: {
        type: String,
    },
    passwordTokenExpirationDate: {
        type: Date,
    }
});

UserSchema.pre('save', async function(next) {
     if(!this.isModified('password')) return next();
   const salt = await  bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    return isMatch
}


module.exports = mongoose.model('User', UserSchema)

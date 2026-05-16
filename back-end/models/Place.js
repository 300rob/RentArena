const mongoose = require('mongoose');
const validator = require('validator')
const PlaceSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true,'Please provide your full name']
    },
    email: { 
    type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        }
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    placeName: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
    },
    placeAddress: {
        type: String,
        require: true,
        minlength: 5,
    },
    category: {
        type: String,
        enum: ['mini-footbal-pitches', "basketball-courts", "tenis-courts"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    proofOfOwnership: { 
        type: String,
    },
    placePhoto: { 
        type: [String],
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 250,
    },
    agreeToTerms: {
        type: Boolean,
        required: true,
    },
    status: {
        type:String,
        enum: ['pending', 'approved', 'rejected'],
        default: "pending",
    },
    sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
},{timestamps: true})

module.exports = mongoose.model('Place', PlaceSchema)
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
        sentBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            date: {
                type: String,
                required: true
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            },
            madeOn: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Place',
                required:true
            },
        status: {
        type:String,
        enum: ['pending', 'approved', 'rejected'],
        default: "pending",
    },
            placeName: {
                type: String,
                required: true,
            },
            placeAddress: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            email: { 
                type: String,
                required: true
            }
},{timestamps: true})

module.exports = mongoose.model('ReservationSchema', reservationSchema)
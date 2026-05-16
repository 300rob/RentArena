const reservation = require('../models/Reservation')
const Place = require('../models/Place')
const User = require('../models/User')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')

const sendReservation = async(req,res) => {
    const {applyId} = req.params;
    const {startTime,endTime,date} = req.body;
    const sentBy = req.user.userId;

    if(!date || !startTime || !endTime || !sentBy) {
        throw new CustomError.BadRequestError("Please fill out the form")
    }

    const occupiedHours = await reservation.findOne({
        applyId,
        date,
        $or: [
            {startTime : {$lt: endTime}, endTime: {$gt: startTime}},
        ],
    })
    if(occupiedHours) {
        throw new CustomError.BadRequestError('Please choose another interval')
    }
    const place = await Place.findById(applyId);
    if (!place) {
        throw new CustomError.NotFoundError(`No facility found with id : ${applyId}`);
    }

    const user = await User.findById(sentBy).select("name email");
    
    const createReservation = await reservation.create({
        date,
        endTime,
        startTime,
        sentBy: sentBy,
        madeOn: applyId,
        placeName: place.placeName,
        placeAddress: place.placeAddress,
        username: user.name,
        email: user.email,
    })

    res.status(StatusCodes.OK).json({createReservation})
}

const getReservationsById = async(req,res) => {
    const {applyId} = req.params;
    const {date} = req.query;
    const getReservation = await reservation.find({madeOn: applyId,date: date, status:'approved'}).sort({startTime: 1})
    res.status(StatusCodes.OK).json({getReservation})
}

const fetchOwnPlacesReservations = async(req,res) => {
    const userId = req.user.userId;
    const PlacesOwnByTheSameUser = await Place.find({sentBy: userId })
    const placeIds = PlacesOwnByTheSameUser.map(place => place._id);

    const PlaceOwnByUserReservation = await reservation.find({
        madeOn: {$in: placeIds},
        status: 'pending',
    })
    res.status(StatusCodes.OK).json({PlaceOwnByUserReservation});
}

const fetchAcceptedReservations = async(req,res) => {
    const userId = req.user.userId;
    const PlacesOwnByTheSameUser = await Place.find({sentBy: userId })
    const placeIds = PlacesOwnByTheSameUser.map(place => place._id);
    
    const PlaceOwnByUserReservation = await reservation.find({
        madeOn: {$in: placeIds},
        status: 'approved',
    })
    res.status(StatusCodes.OK).json({PlaceOwnByUserReservation});
}

const acceptReservation = async(req,res) => {
    const {reservationId} = req.params;
    const userId = req.user.userId;

    const resv = await reservation.findById(reservationId);
    if(!resv) {
        throw new CustomError.NotFoundError('No request with this id');
    }

    const place = await Place.findById(resv.madeOn);
    if (!place || place.sentBy.toString() !== userId) {
        throw new CustomError.UnauthenticatedError('Not authorized to accept this reservation');
    }

    resv.status = 'approved';
    await resv.save();

    res.status(StatusCodes.OK).json({resv})
}

const deleteReservation = async(req,res) => {
    const {reservationId} = req.params;
    const userId = req.user.userId;

    const resv = await reservation.findById(reservationId);
    if(!resv) {
        throw new CustomError.NotFoundError('No reservation with this id');
    }

    const place = await Place.findById(resv.madeOn);
    if (!place || place.sentBy.toString() !== userId) {
        throw new CustomError.UnauthenticatedError('Not authorized to delete this reservation');
    }

    await reservation.findByIdAndDelete(reservationId);
    res.status(StatusCodes.OK).send('Reservation is deleted')
}

module.exports = {
    sendReservation,
    getReservationsById,
    fetchOwnPlacesReservations,
    acceptReservation,
    deleteReservation,
    fetchAcceptedReservations,
}
const express = require('express');
const router = express.Router();

const {authenticateUser, authorizePermisions} = require('../middleware/authentication')
const {sendReservation, getReservationsById,fetchOwnPlacesReservations, acceptReservation, deleteReservation,fetchAcceptedReservations} = require('../controllers/reservationController')

router.route('/getOwnPlaces').get(authenticateUser,authorizePermisions('admin','owner'),fetchOwnPlacesReservations)
router.route('/acceptedReservation').get(authenticateUser,authorizePermisions('admin','owner'),fetchAcceptedReservations)
router.route('/create/:applyId').post(authenticateUser,authorizePermisions('user','admin','owner'), sendReservation)
router.route('/:applyId').get(authenticateUser,authorizePermisions('user','admin','owner'),getReservationsById)
router.route('/accept/:reservationId').patch(authenticateUser,authorizePermisions('owner', 'admin'),acceptReservation)
router.route('/delete/:reservationId').delete(authenticateUser,authorizePermisions('owner', 'admin'),deleteReservation)

module.exports = router
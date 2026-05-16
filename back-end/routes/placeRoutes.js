const express = require('express');
const router = express.Router();

const {createRequest, getAllRequests, deleteRequests, fetchByCategory, fetchRequestById, acceptRequest, getRequestsByStatus,fetchPlacesbyUserId,deletePlaces} = require('../controllers/placeController');
const { authenticateUser, authorizePermisions } = require('../middleware/authentication');
const upload = require('../middleware/multer')
const {uploadMultipleImages, uploadPlaceImage} = require('../controllers/uploadsController')

router.route('/uploadImage').post(authenticateUser,upload.single('image'),uploadPlaceImage);
router.route('/uploadsImages').post(authenticateUser,upload.array('placeImage',10), uploadMultipleImages)

router.route('/apply-for-ownership').post(authenticateUser,createRequest);
router.route('/delete-request/:id').delete(authenticateUser,authorizePermisions('admin'), deleteRequests);

router.route('/').get(authenticateUser, authorizePermisions('admin'),getAllRequests );

router.route('/category/:category').get(authenticateUser, authorizePermisions('owner','admin','user'), fetchByCategory)
router.route('/status/:status/:category').get(authenticateUser,authorizePermisions('owner','admin','user'),getRequestsByStatus)

router.route('/placesbyusers').get(authenticateUser, authorizePermisions('admin', 'owner'), fetchPlacesbyUserId);


router.route('/approve/:requestId').patch(authenticateUser,authorizePermisions('admin'), acceptRequest)
router.route('/ownplaces/:id').delete(authenticateUser,authorizePermisions('admin','owner'),deletePlaces);

router.route('/:applyId').get(authenticateUser, authorizePermisions('owner','admin','user'), fetchRequestById)

module.exports = router

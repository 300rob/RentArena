const express = require('express')
const router = express.Router()
const {authenticateUser,authorizePermisions} = require('../middleware/authentication')

const {showCurrentUser,getSingleUser,updateUser,updateUserPassword,getAllUsers, updateProfile,getUser} = require('../controllers/userController') 

router.route('/').get(authenticateUser,authorizePermisions('admin'),getAllUsers);
router.route('/showMe').get(authenticateUser,showCurrentUser);
router.route('/updateUser').post(authenticateUser,updateUser);
router.route('/updateUserPassword').post(authenticateUser,updateUserPassword)
router.route('/update-profile').put(authenticateUser, updateProfile)
router.route('/:id').get(authenticateUser,getSingleUser)
router.route('/profile/:id').get(authenticateUser, getUser)
module.exports = router

const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication')
const {getUserForSidebar,getMessages,sendMessages} = require('../controllers/messageController')

router.route('/users').get(authenticateUser,getUserForSidebar)
router.route('/:id').get(authenticateUser, getMessages)
router.route('/send/:id').post(authenticateUser, sendMessages)
module.exports = router
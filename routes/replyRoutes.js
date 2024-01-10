const express = require('express')
const router = express.Router()
const {deleteReply, updateReply, findAllReplies, createReply, findReplybyPk} = require('../controllers/replyControllers')
const { protect, restrictToOwnUser } = require('../controllers/authControllers')
const { Reply } = require('../mock/sequelizeSetup')

router
   .route('/')
   .get(findAllReplies)
   .post(protect, createReply)

router
   .route('/:id')
   .get(findReplybyPk)
   .put(protect, restrictToOwnUser(Reply), updateReply)
   .delete(protect, restrictToOwnUser(Reply), deleteReply)

module.exports = router
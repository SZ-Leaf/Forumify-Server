const express = require('express')
const router = express.Router()
const {findAllThreads, updateThread, findThreadByPk, createThread, deleteThread} = require('../controllers/threadControllers')
const { protect, restrictToOwnUser } = require('../controllers/authControllers')
const { Thread } = require('../mock/sequelizeSetup')

router
   .route('/')
   .get(findAllThreads)
   .post(protect, createThread)

router
   .route('/:id')
   .get(findThreadByPk)
   .put(protect, restrictToOwnUser(Thread), updateThread)
   .delete(protect, restrictToOwnUser(Thread), deleteThread)

module.exports = router
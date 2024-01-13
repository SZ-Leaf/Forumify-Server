const express = require('express')
const router = express.Router()
const {findAllUsers, findUserbyPk, createUser, updateUser, deleteUser} = require('../controllers/userControllers')
const { login, protect, correctUser, restrict, restrictToOwnUser } = require('../controllers/authControllers')

router
   .route('/')
   .get(findAllUsers)
   .post(createUser)

router
   .route('/login')
   .post(login)

router
   .route('/:id')
   .get(findUserbyPk)
   .put(protect, correctUser ,updateUser)
   .delete(protect, restrict('admin'), deleteUser)

module.exports = router
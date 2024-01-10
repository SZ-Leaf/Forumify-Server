const { User } = require('../mock/sequelizeSetup');
const { UniqueConstraintError, ValidationError } = require('sequelize')
const bcrypt = require('bcrypt')

const findAllUsers = (req, res) =>{
   User.findAll()
      .then((result) => {
         res.json(result)  
      }).catch((err) => {
         res.status(500).json(error.message)
      });
}

const findUserbyPk = (req, res) =>{
   User.findByPk((parseInt(req.params.id)))
      .then((result) => {
         if (result) {
            res.json({Message: 'User has been found.', data: result})
         }
         else{
            res.status(400).json({message: 'No user found.'})
         }
      }).catch((error) => {
         res.status(500).json({message: 'Error encountered', data: error.message})
      });
}

const createUser = (req, res) => {
   bcrypt.hash(req.body.password, 10)
         .then((hash) => {
            User.create({ ...req.body, password: hash, RoleId: "2" })
               .then((user) => {
                     user.password = ""
                     res.status(201).json({ message: `User created successfully`, data: user })
               })
               .catch((error) => {
                     if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                        return res.status(400).json({ message: error.message })
                     }
                     res.status(500).json({ message: `Could not create user`, data: error.message })
               })
         })
         .catch(error => {
            console.log(error.message)
         })
}

const updateUser = (req, res) => {
   User.findByPk(req.params.id)
      .then((result) => {
         if (result) {
               if (req.body.password) {

                  // hashing password given before saving it
                  return bcrypt.hash(req.body.password, 10)
                     .then((hash) => {

                        req.body.password = hash

                        // Prevent username change
                        req.body.username = result.username

                        return result.update(req.body)
                           .then(() => {
                              res.status(201).json({ message: `User updated.`, data: result })
                           })
                     })
               }
         } else {
               res.status(404).json({ message: `User not found.` })
         }
      })
      .catch(error => {
         if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
               return res.status(400).json({ message: error.message })
         }
         res.status(500).json({ message: 'Error.', data: error.message })
      })
}

const deleteUser = (req, res) => {
   User.findByPk(req.params.id)
      .then((result) => {
         if (result) {
            return result.destroy()
                  .then((result) => {
                     res.json({ mesage: `User has been deleted successfully.`, data: result })
                  })
         } else {
            res.status(404).json({ mesage: `User not found.` })
         }
      })
      .catch((error) => {
         res.status(500).json({ mesage: `Error during deleteUser request.`, data: error.message })
      })
}

module.exports = {findAllUsers, findUserbyPk, createUser, updateUser, deleteUser}
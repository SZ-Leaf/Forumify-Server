const { UniqueConstraintError, ValidationError, QueryTypes, sequelize } = require('sequelize')
const {Thread} = require('../mock/sequelizeSetup')


const findAllThreads = (req, res) => {
   Thread.findAll()
      .then((result) => {
         res.json(result)
      }).catch((error) => {
         res.status(500).json(error.message)
      });
}

const findThreadByPk = (req, res) => {
   Thread.findByPk((parseInt(req.params.id)))
      .then((result) => {
         if (result){
            res.json({message: 'Thread found.', data: result})
         }
         else{
            res.status(400).json({message: 'No thread found.'})
         }
      }).catch((error) => {
         res.status(500).json({message: 'Error encountered', data: error.message})
      });
}

const createThread = (req, res) => {
   const newThread = {...req.body, UserId: req.userId }
   Thread.create(newThread)
      .then((thread) => {
         res.status(201).json({ message: 'Thread Created', data: thread })
      })
      // .catch((error) => {
      //    res.status(500).json({ message: `Could not create Thread`, data: error.message })
      // })
      .catch((error) => {
         if (error.name === 'SequelizeValidationError') {
            // Handle validation errors
            const validationErrors = error.errors.map((e) => ({
               field: e.path,
               message: e.message,
            }));
            res.status(400).json({ message: 'Validation Error', errors: validationErrors });
         } else {
            // Handle other errors
            console.error(error);
            res.status(500).json({ message: 'Could not create Thread', data: error.message });
         }
      });
}

const updateThread = (req, res) => {
   Thread.findByPk((parseInt(req.params.id)))
      .then((result) => {
         if(result){
            return result.update(req.body)
               .then(() =>{
                  res.status(201).json({message: 'Thread updated successfully.', data: result})
               })
         }
         else{
            res.status(400).json({message: 'No thread found.'})
         }
      }).catch((error) => {
         res.status(500).json({message: error.message})
      });
}

const deleteThread = (req, res) => {
   Thread.findByPk(req.params.id)
      .then((result) => {
         if(result){
            return result.destroy()
               .then((result) =>{
                  // if thread deleted successfully
                  res.json({message: 'Thread deleted successfully.', data: result})
               })
         } else {
            res.status(404).json({ mesage: `No Thread found.`})
         }
      }).catch((error) => {
         res.status(400).json({message:'Could not execute request.', data: error.message})
      });
}

module.exports = {findAllThreads, findThreadByPk, updateThread, createThread, deleteThread}
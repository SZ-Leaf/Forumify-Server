const { UniqueConstraintError, ValidationError, QueryTypes } = require('sequelize')

const {Reply} = require('../mock/sequelizeSetup')

const findAllReplies = (req, res) => {
   Reply.findAll()
      .then((result) => {
         res.json(result)
      }).catch((error) => {
         res.status(500).json(error.message)
      });
}

const findReplybyPk = (req, res) =>{
   Reply.findByPk((parseInt(req.params.id)))
      .then((result) => {
         if (result) {
            res.json({Message: 'Reply has been found.', data: result})
         }
         else{
            res.status(400).json({message: 'No reply found.'})
         }
      }).catch((error) => {
         res.status(500).json({message: 'Error encountered', data: error.message})
      });
}

const createReply = (req, res) => {
   const newReply = {...req.body, UserId: req.userId}
   Reply.create(newReply)
      .then((reply) => {
         res.status(201).json({message: 'Reply created successfully.', data: reply})
      }).catch((err) => {
         res.status(404).json({message: 'Could not create reply.', data: err.message})
      });
}

const updateReply = (req, res) => {
   Reply.findByPk(req.params.id)
      .then((result) => {
         if (result){
            return result.update(req.body)
               .then((result) => {
                  res.status(201).json({message: 'Reply updated successfully.', data: result})
               })
         }
         else{
            res.status(400).json({message: 'No reply found.'})
         }
      }).catch((err) => {
         res.status(500).json({message: error.message})
      });
}

const deleteReply = (req, res) => {
   Reply.findByPk(req.params.id)
      .then((result) => {
         if(result){
            return result.destroy()
               .then((result) => {
                  res.json({message: 'Reply deleted successfully.', data: result})
               })
         }
         else{
           res.status(404).json({message: 'Reply not found.'}) 
         }
      }).catch((err) => {
         res.status(400).json({message: 'Could not execute request.', data: err.message})
      });
}

module.exports = {deleteReply, findReplybyPk, updateReply, findAllReplies, createReply}
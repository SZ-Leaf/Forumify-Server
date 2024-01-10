module.exports = (sequelize, DataTypes) => {
   return sequelize.define('Replies',{
      "content": {

         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: {
               msg: 'Content length must be between 1 and 500 characters',
               args: [1, 500], // You can adjust the range as needed
            },
         }
      }
   })
}
module.exports = (sequelize, DataTypes) => {
   return sequelize.define('Threads',{
      "title": {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: {
               msg: 'Title length must be at least 1 character long.',
               min: 1, // You can adjust the range as needed
            },
         }
      },
      "content":{
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: {
               msg: 'Content length must be at least 10 character long.',
               min: 10, // You can adjust the range as needed
            },
         }
      },
      "SubjectId":{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      "UserId": {  // Add UserId field
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   })
}
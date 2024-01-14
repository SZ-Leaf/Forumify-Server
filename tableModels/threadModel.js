module.exports = (sequelize, DataTypes) => {
   return sequelize.define('Threads',{
      "title": {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: {
               msg: 'Title length must be between 1 and 60 characters.',
               min: 1, // You can adjust the range as needed
               max: 60,
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
         // allowNull: false,
      }
   },{
      onDelete: 'CASCADE',
   })
}
const { Sequelize, DataTypes } = require('sequelize');

const UserModel = require('../tableModels/userModel');
const RoleModel = require('../tableModels/roleModel');
const ReplyModel = require('../tableModels/replyModel');
const ThreadModel = require('../tableModels/threadModel')

const {setUsers, setReplies, setRoles, setThreads} = require('./setDataSample');

// Here we are creating a new Sequelize instance with three parameters ('name', 'username', 'pass')
let sequelize = new Sequelize(
   'Forumify',
   'root',
   '',
   {
      host: 'localhost',
      dialect: 'mariadb',
      logging: false
   }
)

// create an instance of the Sequelize model for the User entity by calling the UserModel function and passing the necessary Sequelize-related objects (sequelize and DataTypes).
const Role = RoleModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
const Thread = ThreadModel(sequelize, DataTypes)
const Reply = ReplyModel(sequelize, DataTypes)

Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Thread)
Thread.belongsTo(User)

User.hasMany(Reply)
Reply.belongsTo(User)

Thread.hasMany(Reply)
Reply.belongsTo(Thread)


// synchronize the Sequelize models with the database. The sync method ensures that the database schema matches the Sequelize model definitions. The { force: true } option drops all existing tables in the database and re-creates them, effectively resetting the database.

sequelize.sync({ force: true })
   .then(async () => {
      await setRoles(Role)
      await setUsers(User)
      await setThreads(Thread)
      await setReplies(Reply)
   })
   .catch(error => {
      console.log(error)
   })

sequelize.authenticate()
   .then(() => console.log('La connexion à la base de données a bien été établie.'))
   .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))



module.exports = { User, Role, sequelize, Thread, Reply }
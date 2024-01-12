const { Role, User, Thread, Reply } = require('../mock/sequelizeSetup')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../config/tokenData')

const rolesHierarchy = {
   nonadmin: ["edit"],
   admin: ["admin", "edit"]
}

const login = (req, res) => {
   User.scope('withPassword').findOne({ where: { username: req.body.username } })
      .then((result) => {
         if(!result){
            return res.status(404).json({message: 'User does not exist.'})
         }

         return bcrypt.compare(req.body.password, result.password)
            .then((isValid) => {
               if(!isValid){
                  return res.status(401).json({ message: "Incorrect Password." })
               }
               const token = jwt.sign({
                  data: result.username,
                  UserId: result.id,
                  RoleId: result.RoleId,
               },
                  SECRET_KEY, { expiresIn: 3600 });

               // We can also stock the jwt in a cookie on the client side
               // res.cookie('coworkingapi_jwt', token)   
               res.json({message: 'Login successful', data: token})
            })

      }).catch((err) => {
         res.status(500).json({ data: err.message })
      });
}

const protect = (req, res, next) => {
   if (!req.headers.authorization) {
      return res.status(401).json({ message: `You are not logged in.` })
  }

  const token = req.headers.authorization.split(' ')[1]

   // if jwt was stocked in client side cookie
   // if (!req.cookies.coworkingapi_jwt) {
   //     return res.status(401).json({ message: `You are not logged in.` })
   // }

   // const token = req.cookies.coworkingapi_jwt

   if(token){
      try {
         const decoded = jwt.verify(token, SECRET_KEY);
         req.username = decoded.data;
         req.userId = decoded.UserId;
         next()
      } catch (error) {
         return res.status(403).json({ message: `Invalid token.` })
      }
   }
}

const correctUser = (req, res, next) => {
   User.findOne({ where: {username: req.username} })

      .then((authUser) => {

         console.log(authUser.id, parseInt(req.params.id))

         if (authUser.id === parseInt(req.params.id) || authUser.RoleId === "1") {
            next()
         } else {
            res.status(403).json({ message: "Insufficient rights." })
         }


      }).catch((err) => {
         res.status(500).json({ message: err.message })
      });
}

const restrict = (roleParam) => {
   return (req, res, next) => {
      const token = req.headers.authorization.split(' ')[1];

      try {
         const decoded = jwt.verify(token, SECRET_KEY);
         const { username, role_id } = decoded;

         User.findOne({
            where: {
               username: req.username
            }
         })
            .then(user => {
               Role.findByPk(user.RoleId)
                  .then(role => {
                     // role.label issued by the token
                     // roleParam is the parameter for the fonction restrict()
                     if (rolesHierarchy[role.label].includes(roleParam)) {
                        next()
                     } else {
                        res.status(403).json({ message: `Insufficient rights.` })
                     }
                  })
                  .catch(error => {
                     console.log(error.message)
                  })
            })
            .catch(error => {
               console.log(error)
            })
      }
      catch (error) {
         console.error(error.message);
         res.status(403).json({ message: "Invalid token." });
      }
   }
}

const restrictToOwnUser = (model) => {
   return (req, res, next) => {
      User.findOne(
         {
            where:
                  { username: req.username }
         })
         .then(user => {
            if (!user) {
                  return res.status(404).json({ message: `No user found.` })
            }
            // check if user is admin
            return Role.findByPk(user.RoleId)
                  .then(role => {
                     if (rolesHierarchy[role.label].includes('admin')) {
                        return next()
                     }
                     model.findByPk(req.params.id)
                        .then(resource => {
                              if (!resource) return res.status(404).json({ message: `Ressource doesn't exist.` })
                              if (user.id === resource.UserId) {
                                 next()
                              } else {
                                 res.status(403).json({ message: `You are not the author.` })
                              }
                        })
                        .catch(error => {
                              return res.status(500).json({ message: error.message })
                        })
                  })
         })
         .catch(error => console.log(error.message))
   }
}

module.exports = { login, protect, restrict, correctUser, restrictToOwnUser }
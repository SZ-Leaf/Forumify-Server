const mockUsers = require('./mockUsers')
const mockReply = require('./mockReply')
const mockThreads = require('./mockThreads')

// Add bcrypt for password hashing
const bcrypt = require('bcrypt');

const setUsers = (User) => {
    return Promise.all(mockUsers.map(user => {
        return bcrypt.hash(user.password, 10)
            .then(hashResult => {
                return User.create({ ...user, password: hashResult })
                    .then(() => { })
                    .catch((error) => {
                        console.log(error.message)
                    })
            })
        }
    ))
}

const setThreads = (Thread) => {
    return Promise.all(mockThreads.map(thread =>{
        const newThread = {...thread}
        return Thread.create(newThread)
    }))
}

const setReplies = (Reply) => {
    return Promise.all(mockReply.map(reply => {
        const newReply = {...reply}
        return Reply.create(newReply)
    }))
}

const setRoles = async (Role) => {
    // Check if roles already exist
    const adminRole = await Role.findOne({ where: { label: 'admin' } });
    const nonAdminRole = await Role.findOne({ where: { label: 'nonadmin' } });

    // Create roles if they don't exist
    if (!adminRole) {
        await Role.create({ label: 'admin' });
    }

    if (!nonAdminRole) {
        await Role.create({ label: 'nonadmin' });
    }
};

module.exports = {setUsers, setRoles, setReplies, setThreads}

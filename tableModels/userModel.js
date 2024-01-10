module.exports = (sequelize, DataTypes) => {

    // creating a new Users model table through sequelize.define to be used in sequelize setup when starting our server
    return sequelize.define('Users', {

            // defining User model attributes
            username: {

                // cannot be null
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: "Name already taken."
                },
                unique: {
                    msg: "Username already taken"
                },

                // name value validation
                validate: {
                    len: {

                        // min lengh 3 for username
                        msg: "Name must be at least 3 characters long.",
                        args: [3, 20]
                    }
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,

                validate: {
                    len: {

                        // min lengh 3 for username
                        msg: "Password must be at least 3 characters long.",
                        min: 3
                    }
                },
            },
        },{
            onDelete: 'CASCADE',
            defaultScope: {
                attributes: { exclude: ['password'] }
            },
            scopes: {
                withPassword: {
                    attributes: {}
                }
            }
        }
    );
}
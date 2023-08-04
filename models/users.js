
module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid: type.STRING,
        name: type.STRING,
        email: type.STRING,
        role: type.STRING,
        password: {
            type: type.STRING,
        },
        last_login: {
            type: type.DATE,
            defaultValue: type.CURRENT_DATE
        },
 
    })
};


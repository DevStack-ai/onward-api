const Sequelize = require('sequelize')
const UserModel = require("../models/users")
const ContainerModel = require("../models/containers")
const HistoryModel = require("../models/history")

const db_name = process.env.DB_NAME
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const db_host = process.env.DB_HOST



const sequelize = new Sequelize(db_name, db_user, db_pass, {
    host: db_host,
    dialect: 'mysql',
    logging: false
});


const Users = UserModel(sequelize, Sequelize);
const History = HistoryModel(sequelize, Sequelize)
const Containers = ContainerModel(sequelize, Sequelize);


sequelize.sync({ logs: false, alter: true })
    .then(() => {
        console.log('DB connected *');
    });


module.exports = { Users, Containers, History };  
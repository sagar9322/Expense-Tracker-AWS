const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker-aws', 'root', "Sagar@1234", {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const expenseDetail = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },

  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = expenseDetail;
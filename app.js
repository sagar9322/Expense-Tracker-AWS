const express = require('express');
const cors = require('cors');
const User = require('./models/userSignUp');
const ExpenseDetail = require('./models/expense');
const Income = require('./models/income');
const Order = require('./models/orders');



const app = express();

app.use(cors());
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
app.use(userRoutes);

User.hasMany(ExpenseDetail);
ExpenseDetail.belongsTo(User);
Income.belongsTo(User);
User.hasMany(Income);
User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
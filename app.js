const express = require('express');
const cors = require('cors');
const User = require('./models/userSignUp');
const ExpenseDetail = require('./models/expense');
const Income = require('./models/income');
const Order = require('./models/orders');
const Leaderboard = require('./models/leaderboard');
const ForgotPasswordRequest = require('./models/forgotPassword');
const path = require('path');
const helmet = reuire('helmet');
const compression = require('compression');
const morgan = require('morgan');


const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'acess.log'), {flag: 'a'});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));


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
Leaderboard.belongsTo(User);
User.hasMany(ForgotPasswordRequest);
// app.use(express.static('public'));




sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
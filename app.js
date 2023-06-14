const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');

app.use(userRoutes);


sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
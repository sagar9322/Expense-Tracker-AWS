const jwt = require('jsonwebtoken');
const User = require('../models/userSignUp');

exports.authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token , 'secretkey');
        
        User.findByPk(user.userId).then(user => {
            req.user = user;
            next();
        })
    }catch(err){
        console.log(err);

    }
}
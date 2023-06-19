const jwt = require('jsonwebtoken');
const User = require('../models/userSignUp');

exports.authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, 'secretkey', function(err, decoded) {
            if (err) throw err;
            console.log(decoded);
            return decoded;
        });
        console.log(">>>>", user);
        
        User.findByPk(user.userId).then(user => {
            req.user = user;
            next();
        })
    }catch(err){
        console.log(err);

    }
}
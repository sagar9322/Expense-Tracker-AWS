const userDetail = require('../models/userSignUp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RazorPay = require('razorpay');

function generateAccessToken(id){
    return jwt.sign({userId: id}, 'secretkey');
}


exports.postUserDetails = async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const availableUser = await userDetail.findAll({ where: { email: email } });

    if (availableUser.length !== 0) {
        return res.status(409).json({ message: 'User is already available' });
    } else {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await userDetail.create({
                name: name,
                email: email,
                password: hashedPassword
            });
            res.status(200).json({ message: "submited"});
        }

        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Error occurred while saving user details" });
        }
    }

}

exports.getUserDetail = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const user = await userDetail.findOne({ where: { email: email } });

    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({ message: 'Login Successfully',token: generateAccessToken(user.id)});
        } else {
            return res.status(401).json({ message: "Password is incorrect" });
        }
    } else {
        return res.status(404).json({ message: "Email or Password doesn't match" });
    }

}

exports.buyPremium = async (req, res, next) => {
try{
    var rzp = new RazorPay({
        key_id: "rzp_test_HO087NQYOxof6t",  //process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET
        key_secret: "lIYb3rjyamBm7ULEpynXC5r9"
    })
    const amount = 250;

    rzp.orders.create({amount, currency: "INR"}, (err, order) => {
        if(err){
            throw new Error(JSON.stringify(err));
        }
        console.log(">>>>>", order);
        req.user.createOrder({orderid: order.id, status: order.status}).then(() => {
            return res.status(201).json({order, key_id: rzp.key_id});
        }).catch(err => {
            throw new Error(err);
        })
    })
}catch(err){
    console.log(err);
    res.status(403).json({message: "something went wrong", error: err})
}
}
const userDetail = require('../models/userSignUp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RazorPay = require('razorpay');
const Order = require('../models/orders');
const sequelize = require('../util/database');
const ExpenseDetail = require('../models/expense');
const Leaderboard = require('../models/leaderboard');

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
    console.log(user)

    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({ message: 'Login Successfully', token: generateAccessToken(user.id)});
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

exports.updatePremium = (req, res, next) =>{
    try{
        const {payment_id, order_id} = req.body;
        Order.findOne({where: {orderid: order_id}}).then(order => {
            order.update({paymentid: payment_id, status: "SUCCESSFUL"}).then(() => {
                req.user.update({ ispremiumuser: true}).then(() => {
                    return res.status(202).json({success: true, message: "Transaction Successful"});
                }).catch((err) => {
                    throw new Error(err);
                })
            }).catch(err => {
                throw new Error(err);
            })
        })
    }catch(err) {
        throw new Error(err);
    }
}

exports.getLeaderboard = async (req,res,next)=> {
    Leaderboard.findAll()
    .then(details => {
        res.status(200).json({detail: details});
    }).catch(err=> console.log(err));

    // try{
    //     const leaderBoard = await userDetail.findAll({
    //         attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
    //         include: [
    //             {
    //             model: ExpenseDetail,
    //             attributes: []
    //             }
    //         ],
    //         group: ['user.id'],
    //         order: [['total_cost', 'DESC']]
    //     })
    //     res.status(200).json(leaderBoard);
    // }catch(err){
    //     console.log(err);
    // }
}
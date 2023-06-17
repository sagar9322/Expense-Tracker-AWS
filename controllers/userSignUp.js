const userDetail = require('../models/userSignUp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RazorPay = require('razorpay');
const Order = require('../models/orders');
const sequelize = require('../util/database');
const ExpenseDetail = require('../models/expense');
const Leaderboard = require('../models/leaderboard');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
require('dotenv').config();

function generateAccessToken(id) {
    return jwt.sign({ userId: id }, 'secretkey');
}

exports.postUserDetails = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const availableUser = await userDetail.findAll({ where: { email: email } });

        if (availableUser.length !== 0) {
            return res.status(409).json({ message: 'User is already available' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await userDetail.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        res.status(200).json({ message: "submitted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error occurred while saving user details" });
    }
};

exports.getUserDetail = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await userDetail.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: "Email or Password doesn't match" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({ message: 'Login Successfully', token: generateAccessToken(user.id) });
        } else {
            return res.status(401).json({ message: "Password is incorrect" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.buyPremium = async (req, res, next) => {
    try {
        const rzp = new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 250;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            try {
                await req.user.createOrder({ orderid: order.id, status: order.status });
                res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                throw new Error(err);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
};

exports.updatePremium = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await order.update({ paymentid: payment_id, status: "SUCCESSFUL" });
        await req.user.update({ ispremiumuser: true });

        res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.getLeaderboard = async (req, res, next) => {
    try {
        const details = await Leaderboard.findAll();
        res.status(200).json({ detail: details });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
}


exports.getPassword = (req, res, next)=> {

    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.SIB_KEY;
    
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: 'sagarcorporateacc@gmail.com'
    }
    const receivers = [
        {
            email: `${req.body.email}`
        }
    ]

    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Forgot Email Recovery",
        textContent: 'Your Password is ****'
    }).then((dtl)=> {
        console.log(dtl)
    }).catch(err => console.log(err));
}
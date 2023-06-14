const userDetail = require('../models/userSignUp');
const bcrypt = require('bcrypt');


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
            await userDetail.create({
                name: name,
                email: email,
                password: hashedPassword
            });
            res.status(200).json({ message: "submited" });
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
            return res.status(200).json({ message: 'Login Successfully' });
        } else {
            return res.status(401).json({ message: "Password is incorrect" });
        }
    } else {
        return res.status(404).json({ message: "Email or Password doesn't match" });
    }

}
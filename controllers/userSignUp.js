const userDetail = require('../models/userSignUp');


exports.postUserDetails = async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const availableUser = await userDetail.findAll({ where: { email: email } });

    if (availableUser.length !== 0) {
        return res.status(409).json({ message: 'User is already available' });
    } else {
        await userDetail.create({
            name: name,
            email: email,
            password: password
        })
            .then(result => {
                res.status(200).json({ message: "submited" });
            })
            .catch(err => {
                console.log(err);
            });
    }

}
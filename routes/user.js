const express = require('express');
const router = express.Router();

const userRouter = require('../controllers/userSignUp');



router.post('/submit-detail', userRouter.postUserDetails);

module.exports = router;
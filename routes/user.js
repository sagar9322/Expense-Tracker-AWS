const express = require('express');
const router = express.Router();

const userRouter = require('../controllers/userSignUp');



router.post('/sign-up', userRouter.postUserDetails);
router.post('/log-in', userRouter.getUserDetail);

module.exports = router;
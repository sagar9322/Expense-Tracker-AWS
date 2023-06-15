const express = require('express');
const router = express.Router();

const userRouter = require('../controllers/userSignUp');
const expenseRouter = require('../controllers/expense');
const incomeRouter = require('../controllers/income');



router.post('/sign-up', userRouter.postUserDetails);
router.post('/log-in', userRouter.getUserDetail);
router.post('/expense', expenseRouter.postExpenseDetail);
router.get('/get-expense', expenseRouter.getExpenseDetail);
router.post('/income', incomeRouter.postIncomeDetail);
router.get('/get-income', incomeRouter.getIncomeDetail);

module.exports = router;
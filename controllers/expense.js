const ExpenseDetail = require('../models/expense');
const Leaderboard = require('../models/leaderboard');
const sequelize = require('../util/database');

exports.postExpenseDetail = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
    const user = await Leaderboard.findByPk(req.user.id);
    
    if (!user) {
      await Leaderboard.create({
        username: req.user.name,
        totalexpense: amount
      }, {transaction: t});
    } else {
      const expense = user.totalexpense;
      await user.update({totalexpense: Number(amount) + Number(expense)}, {transaction: t});
    }

    await ExpenseDetail.create({
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id
    }, {transaction: t});

    await t.commit();

    res.status(200).json({message: "submitted"});
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({message: "An error occurred"});
  }
};

exports.getExpenseDetail = async (req, res, next) => {
  try {
    const details = await ExpenseDetail.findAll({where: {userId: req.user.id}});
    res.setHeader('Content-Type', 'text/html');
    res.status(200).json({detail: details, ispremium: req.user.ispremiumuser});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "An error occurred"});
  }
};

exports.deleteList = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const listItem = await ExpenseDetail.findOne({
      where: {
        id: req.params.listId,
        UserId: req.user.id
      }
    });
    const user = await Leaderboard.findByPk(req.user.id);

    const expense = user.totalexpense;
      await user.update({totalexpense: Number(expense) - Number(listItem.amount)}, {transaction: t});
    
    if (!listItem) {
      await t.rollback();
      return res.status(404).json({message: "List item not found"});
    }

    
    await listItem.destroy({transaction: t});
    await t.commit();
    res.status(200).json({message: "done"});
  } catch (err) {
    
    console.log(err);
    await t.rollback();
    res.status(500).json({message: "An error occurred"});
  }
};
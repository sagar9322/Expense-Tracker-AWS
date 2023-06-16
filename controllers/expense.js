const ExpenseDetail = require('../models/expense');


exports.postExpenseDetail = (req, res, next) => {
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    ExpenseDetail.create({
        category: category,
        description: description,
        amount: amount,
        userId: req.user.id
    })
    .then(result => {
        res.status(200).json({message: "submited"});
      })
      .catch(err => {
        console.log(err);
      });
}

exports.getExpenseDetail = (req, res, next) => {
    ExpenseDetail.findAll({where: {userId: req.user.id}})
  .then(details => {
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(details)); 
  })
  .catch(err => {
    console.log(err);
  });
}

exports.deleteList = (req, res, next)=> {
  ExpenseDetail.findOne({
    where: {
      id: req.params.listId,
      UserId: req.user.id
    }
  })
  .then(listItem => {
    return listItem.destroy();
  }).then(()=>{
    res.status(200).json({message: "done"});
  }).catch(err => {
    console.log(err);
  })
}
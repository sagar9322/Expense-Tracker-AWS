const expenseDetail = require('../models/expense');


exports.postExpenseDetail = (req, res, next) => {
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    expenseDetail.create({
        category: category,
        description: description,
        amount: amount
    })
    .then(result => {
        res.status(200).json({message: "submited"});
      })
      .catch(err => {
        console.log(err);
      });
}

exports.getExpenseDetail = (req, res, next) => {
    expenseDetail.findAll()
  .then(details => {
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(details)); 
  })
  .catch(err => {
    console.log(err);
  });
}
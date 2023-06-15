const incomeDetail = require('../models/income');


exports.postIncomeDetail = (req, res, next) => {
    const income = req.body.income;

    incomeDetail.create({
        income: income
    })
    .then(result => {
        res.status(200).json({message: "submited"});
      })
      .catch(err => {
        console.log(err);
      });
}

exports.getIncomeDetail = (req, res, next) => {
    incomeDetail.findAll()
  .then(details => {
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(details)); 
  })
  .catch(err => {
    console.log(err);
  });
}
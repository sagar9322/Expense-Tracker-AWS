const incomeDetail = require('../models/income');


exports.postIncomeDetail = (req, res, next) => {
    const income = req.body.income;

    incomeDetail.create({
        income: income,
        userId: req.user.id
    })
    .then(result => {
        res.status(200).json({message: "submited"});
      })
      .catch(err => {
        console.log(err);
      });
}

exports.getIncomeDetail = (req, res, next) => {
    incomeDetail.findAll({where: {userId: req.user.id}})
  .then(details => {
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(details)); 
  })
  .catch(err => {
    console.log(err);
  });
}
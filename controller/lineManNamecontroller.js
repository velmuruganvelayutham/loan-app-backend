const lineManNameModel = require("../models/lineManNamemodel")
const loanModel = require("../models/loanModel")
const lineModel = require("../models/lineModel")
const receiptModel = require("../models/receiptModel")
const LedgerModel = require("../models/ledgerModel");
//const lineCheckingModel = require("../models/lineCheckingModel");
const pendingloanModel = require("../models/loanPendingModelView");
//all lineman
module.exports.getLineManNames = async (req, res) => {
  const cityNames = await lineManNameModel.find()
  res.send(cityNames)
}
//get linemanmaxcode
module.exports.getMaxLineManCode = async (req, res) => {
  const maxcode = await lineManNameModel.aggregate([
    {
      "$group": {
        "_id": null,
        "maxCode": { $max: '$linemancode' },
      },
    },
    {
      "$project": {
        "_id": 0,
        "maxCode": { $ifNull: ['$maxCode', 0] }
      },
    },
  ]);
  res.send(maxcode)
}



//create lineman
module.exports.saveLineManNames = (req, res) => {
  const linemannamesdetails = new lineManNameModel({
    linemancode: req.body.linemancode,
    linemanname: req.body.linemanname,
    mobileno: req.body.mobileno
  })
  lineManNameModel.create(linemannamesdetails)
    .then((data) => {
      console.log("Saved SuccessFully");
      res.status(201).send(data)
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}
//update lineman
module.exports.updateLineManNames = (req, res) => {
  const { linemancode } = req.params
  lineManNameModel.findByIdAndUpdate(linemancode, { linemanname: req.body.linemanname, mobileno: req.body.mobileno })
    .then(() => res.send("Updated Successfully"))
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}
//Delete LineMan
module.exports.deleteLineManNames = (req, res) => {
  const { id } = req.params
  lineManNameModel.findByIdAndDelete(id)
    .then(() => res.send("Deleted Successfully"))
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}


//Loan Section//
//get loanmaxcode
module.exports.getMaxLoanCode = async (req, res) => {
  const maxcode = await loanModel.aggregate([
    {
      "$group": {
        "_id": null,
        "maxCode": { $max: '$loannumber' },
      },
    },
    {
      "$project": {
        "_id": 0,
      },
    },
  ]);
  res.send(maxcode)
}
//create loan
module.exports.saveLoan = async (req, res) => {

  const loandetails = new loanModel({
    loannumber: req.body.loanno,
    customer_id: req.body.customer_id,
    lineman_id: req.body.lineman_id,
    weekno: req.body.weekno,
    bookno: req.body.bookno,
    lineno: req.body.lineno,
    document: req.body.document,
    cheque: req.body.cheque,
    weekcount: req.body.weekcount,
    startdate: req.body.startdate,
    givendate: req.body.givendate,
    duedate: req.body.duedate,
    finisheddate: req.body.finisheddate,
    givenamount: req.body.givenamount,
    documentamount: req.body.documentamount,
    interestamount: req.body.interestamount,
    totalamount: req.body.totalamount,
    dueamount: req.body.dueamount,
    paidamount: req.body.paidamount
  })

  await loanModel.create(loandetails)
    .then((data) => {
      console.log("Saved SuccessFully");
      ///return res.status(201).send(data)
    })
    .catch((err) => {
      console.log(err);
      //return res.send({error:err,msg:"somthing went wrong"})
    })

  ///receipt section
  let receiptdetails = new receiptModel({
    loannumber: req.body.loanno,
    receiptdate: req.body.startdate,
    customer_id: req.body.customer_id,
    weekno: req.body.weekno,
    collectedamount: req.body.paidamount
  })
  await receiptModel.create(receiptdetails)
    .then((data) => {
      console.log("Saved SuccessFully");
      res.status(201).send(data)
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })



}

//old loan Ref details//
module.exports.getOldLoanRef = async (req, res) => {

  let param = req.query.loanno

  const loanreference = await loanModel.aggregate([
    {
      $lookup: {
        from: "customercityview",
        localField: "customer_id",
        foreignField: "_id", as: "customerdetails"
      },
    },
    {
      $unwind: "$customerdetails"
    },
    {
      $project: {
        "loannumber": 1,
        "startdate": 1,
        "givendate": 1,
        "duedate": 1,
        "finisheddate": 1,
        "givenamount": 1,
        "documentamount": 1,
        "interestamount": 1,
        "totalamount": 1,
        "dueamount": 1,
        "paidamount": 1,
        "customer_id": 1,
        "lineman_id": 1,
        "fathername": "$customerdetails.fathername",
        "address": "$customerdetails.address",
        "work": "$customerdetails.work",
        "mobileno": "$customerdetails.mobileno",
        "cityname": "$customerdetails.cityname",
        "lineno": 1,
        "weekno": 1,
        "bookno": 1,
        "document": 1,
        "cheque": 1,
        "weekcount": 1

      }
    },

    {
      $match: { loannumber: Number(param) }
    }

  ]);
  res.send(loanreference);
}

//all lines
module.exports.getLineNames = async (req, res) => {

  const lineNames = await lineModel.find()
  res.send(lineNames)
}
///all ledger
module.exports.getLedger = async (req, res) => {
  const loanno = req.query['loanno'];
  const ledger = await LedgerModel.aggregate(
    [
      {
        $match: {

          "loannumber": { $eq: Number(loanno) }
        }
      }
    ]
  )
  res.send(ledger)
}

///line checking details//
module.exports.getCheckingDetails = async (req, res) => {
  const cityid = req.query['city_id'];
  const checking = await pendingloanModel.aggregate([
    [
      {
        '$lookup': {
          'from': 'receipttables', 
          'pipeline': [
            {
              '$match': {
                'receiptdate': {
                  '$gte': new Date('Tue, 10 Oct 2023 00:00:00 GMT'), 
                  '$lte': new Date('Mon, 30 Oct 2023 00:00:00 GMT')
                }
              }
            }
          ], 
          'localField': 'loannumber', 
          'foreignField': 'loannumber', 
          'as': 'joined'
        }
      }, {
        '$unwind': {
          'path': '$joined', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': {
            'loannumber': '$loannumber', 
            'startdate': '$startdate', 
            'finisheddate': '$finisheddate', 
            'bookno': '$bookno', 
            'lineno': '$lineno', 
            'customer_id': '$customer_id', 
            'totalamount': '$totalamount', 
            'customer': '$customer', 
            'dueamount': '$dueamount', 
            'city': '$city', 
            'cityid': '$cityid', 
            'fathername': '$fathername', 
            'work': '$work', 
            'address': '$address', 
            'mobileno': '$mobileno', 
            'relationtype': '$relationtype'
          }, 
          'collected': {
            '$sum': '$joined.collectedamount'
          }
        }
      }, {
        '$project': {
          'loannumber': 1, 
          'addFields': {
            'daysCount': {
              '$round': {
                '$divide': [
                  {
                    '$subtract': [
                      new Date('Mon, 30 Oct 2023 00:00:00 GMT'), new Date('Tue, 10 Oct 2023 00:00:00 GMT')
                    ]
                  }, 86400000 * 7
                ]
              }
            }
          }, 
          'customer_id': 1, 
          'customer': 1, 
          'totalamount': 1, 
          'dueamount': 1, 
          'city': 1, 
          'collected': 1, 
          'cityid': 1, 
          'fathername': 1, 
          'work': 1, 
          'address': 1, 
          'mobileno': 1, 
          'relationtype': 1
        }
      }, {
        '$replaceRoot': {
          'newRoot': {
            '$mergeObjects': [
              {
                'customer': '', 
                'loannumber': '$_id.loannumber', 
                'totalamount': '$_id.totalamount', 
                'city': '$_id.city', 
                'cityid': '$_id.cityid'
              }, '$$ROOT'
            ]
          }
        }
      }
    ]
  ])


  /*const checking=await LineCheckingModel.aggregate([
    {
      $match:{
        'cityid':{$eq:cityid}
      }
    }
  ])*/
  res.send(checking)
}
//all loan
module.exports.getLoannumbers = async (req, res) => {
  const loannumbers = await loanModel.find()
  res.send(loannumbers)
}

const lineManNameModel = require("../models/lineManNamemodel")
const loanModel = require("../models/loanModel")
const lineModel = require("../models/lineModel")
const receiptModel = require("../models/receiptModel")
const LedgerModel = require("../models/ledgerModel");
//const lineCheckingModel = require("../models/lineCheckingModel");
const pendingloanModel = require("../models/loanPendingModelView");
const companyModel = require("../models/companyModel");
const { default: mongoose } = require("mongoose");
//all lineman
module.exports.getLineManNames = async (req, res) => {
  const cityNames = await lineManNameModel.find()
  res.send(cityNames)
}
//get linemanmaxcode
/*module.exports.getMaxLineManCode = async (req, res) => {
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
}*/



//create lineman
module.exports.saveLineManNames = (req, res) => {
  const linemannamesdetails = new lineManNameModel({
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
  const { id } = req.params
  lineManNameModel.findByIdAndUpdate(id, { linemanname: req.body.linemanname, mobileno: req.body.mobileno })
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
    city_id: req.body.city_id,
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

//update Loan Number//
module.exports.updateLoan = async (req, res) => {
  await loanModel.findOneAndUpdate({ loannumber: req.body.oldloanno }, { loannumber: req.body.newloanno }
  ).then(() =>
    console.log("Updated SuccessFully")
  ).catch((err) => {
    console.log(err);
    res.send({ error: err, msg: "somthing went wrong" })
  })

  //receipt section//
  await receiptModel.updateMany({ loannumber: req.body.oldloanno }, { loannumber: req.body.newloanno }
  ).then(() =>
    res.send("Updated Successfully")
  ).catch((err) => {
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
        "city": "$customerdetails.city",
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
    {
      '$lookup': {
        'from': 'receipttables',
        'let': {
          'loannumber': '$loannumber'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$loannumber', '$$loannumber'
                ]
              }
            }
          }, {
            '$group': {
              '_id': '$loannumber',
              'collected': {
                '$sum': '$collectedamount'
              }
            }
          }
        ],
        'as': 'joined'
      }
    }, {
      '$lookup': {
        'from': 'receipttables',
        'let': {
          'loannumber': '$loannumber'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$loannumber', '$$loannumber'
                    ]
                  }, {
                    '$gt': [
                      '$receiptdate', new Date(req.query['fromdate'])
                    ]
                  }, {
                    '$lte': [
                      '$receiptdate', new Date(req.query['todate'])
                    ]
                  }
                ]
              }
            }
          }, {
            '$group': {
              '_id': '$loannumber',
              'collected': {
                '$sum': '$collectedamount'
              }
            }
          }
        ],
        'as': 'receipt'
      }
    },
    {
      '$lookup': {
        'from': 'receipttables',
        'let': {
          'loannumber': '$loannumber',
          'startdate': '$startdate'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$loannumber', '$$loannumber'
                    ]
                  }, {
                    '$lt': [
                      '$receiptdate', new Date(req.query['fromdate'])
                    ]
                  }
                ]
              }
            }
          }, {
            '$group': {
              '_id': '$loannumber',
              'collectedbefore': {
                '$sum': '$collectedamount'
              }
            }
          },
          {
            '$addFields': {
              'daysCountbefore': {
                '$add': [
                  {
                    '$round': {
                      '$divide': [
                        {
                          '$subtract': [
                            new Date(req.query['fromdate']), '$$startdate'
                          ]
                        }, 86400000 * 7
                      ]
                    }
                  },
                ]
              }
            }
          }
        ],
        'as': 'receiptbeforedate'
      }
    },
    {
      '$unwind': {
        'path': '$joined',
        'includeArrayIndex': 'string',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$receipt',
        'includeArrayIndex': 'string',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$unwind': {
        'path': '$receiptbeforedate',
        'includeArrayIndex': 'string',
        'preserveNullAndEmptyArrays': true
      }
    },

    {
      '$project': {
        'loannumber': 1,
        'startdate': 1,
        'finisheddate': 1,
        'addFields': {
          'receiptpendingweek': {
            '$subtract': [
              '$receiptbeforedate.daysCountbefore', {
                '$divide': [
                  {
                    '$ifNull': [
                      '$receiptbeforedate.collectedbefore', 0
                    ]
                  }, '$dueamount'
                ]
              }
            ]
          },
        },
        'lineman_id': 1,
        'linemanname': 1,
        'lineno': 1,
        'bookno': 1,
        'customer_id': 1,
        'customer': 1,
        'totalamount': 1,
        'dueamount': 1,
        'city': 1,
        'collectedamountdate': { $ifNull: ["$receipt.collected", 0] },
        'cityid': 1,
        'fathername': 1,
        'work': 1,
        'address': 1,
        'mobileno': 1,
        'relationtype': 1,
        'collectedtotal': { $ifNull: ["$joined.collected", 0] },
        'weekcount': 1,
        'collectedamountbefore': { $ifNull: ["$receiptbeforedate.collectedbefore", 0] }
      }
    },
    {
      $match: {
        'cityid': { $eq: cityid }
      }
    }
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
//previous week collection details//
module.exports.getPreviousweekDetails = async (req, res) => {
  const cityid = req.query['city_id'];
  const previous = await pendingloanModel.aggregate([
    {
      '$lookup': {
        'from': 'receipttables',
        'let': {
          'loannumber': '$loannumber'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$loannumber', '$$loannumber'
                    ]
                  }, {
                    '$eq': [
                      '$receiptdate', new Date(req.query['fromdate'])
                    ]
                  }
                ]
              }
            }
          }
        ],
        'as': 'joined'
      }
    }, {
      '$match': {
        'joined': {
          '$size': 1
        }
      }
    }, {
      '$unwind': {
        'path': '$joined',
        'includeArrayIndex': 'string',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'loannumber': 1,
        'startdate': 1,
        'customer': 1,
        'dueamount': 1,
        'weekno': '$joined.weekno',
        'collectedamount': '$joined.collectedamount',
        'city': 1,
        'bookno': 1,
        'lineno': 1,
        'lineman_id': 1,
        'lineman': {
          '$toString': '$lineman_id'
        }
      }
    },
    {
      '$match': {
        'lineman': {
          '$eq': cityid
        }
      }
    },
    {
      '$sort': {
        'loannumber': 1
      }
    }
  ])
  res.send(previous)
}
//new account address
module.exports.getNewAccountDetails = async (req, res) => {
  const cityid = req.query['city_id'];
  const newAccount = await pendingloanModel.aggregate([
    {
      '$match': {
        '$and': [
          {
            'startdate': {
              '$gt': new Date(req.query['fromdate'])
            }
          }, {
            'startdate': {
              '$lte': new Date(req.query['todate'])
            }
          }
        ]
      }
    }, {
      '$project': {
        'loannumber': 1,
        'startdate': 1,
        'customer': 1,
        'relationtype': 1,
        'fathername': 1,
        'mobileno': 1,
        'address': 1,
        'city': 1,
        'givenamount': 1,
        'totalamount': 1,
        'lineno': 1,
        'linemanname': 1,
        'lineman': {
          '$toString': '$lineman_id'
        }
      }
    },
    {
      '$match': {
        'lineman': {
          '$eq': cityid
        }
      }
    },
    {
      '$sort': {
        'loannumber': 1
      }
    }
  ])
  res.send(newAccount)
}

//weekendaccountdetails//
module.exports.getweekEndAccount = async (req, res) => {
  const cityid = req.query['city_id'];
  const weekend = await pendingloanModel.aggregate([
    {
      '$match': {
        '$and': [
          {
            'finisheddate': {
              '$gt': new Date(req.query['fromdate'])
            }
          }, {
            'finisheddate': {
              '$lte': new Date(req.query['todate'])
            }
          }
        ]
      }
    },

    {
      '$lookup': {
        'from': 'receipttables',
        'let': {
          'loannumber': '$loannumber'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$loannumber', '$$loannumber'
                    ]
                  }, {
                    '$lte': [
                      '$receiptdate', new Date(req.query['todate'])
                    ]
                  }
                ]
              }
            }
          }, {
            '$group': {
              '_id': '$loannumber',
              'collected': {
                '$sum': '$collectedamount'
              }
            }
          }
        ],
        'as': 'joined'
      }
    }, {
      '$unwind': {
        'path': '$joined',
        'includeArrayIndex': 'string',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'receipttables',
        'let': {
          'loannumber': '$loannumber'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$loannumber', '$$loannumber'
                    ]
                  }, {
                    '$lte': [
                      '$receiptdate', new Date(req.query['todate'])
                    ]
                  }
                ]
              }
            }
          }, {
            '$sort': {
              'receiptdate': -1
            }
          }, {
            '$limit': 1
          }
        ],
        'as': 'lastreceipt'
      }
    }, {
      '$unwind': {
        'path': '$lastreceipt',
        'includeArrayIndex': 'string',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'loannumber': 1,
        'bookno': 1,
        'document': 1,
        'customer': 1,
        'city': 1,
        'lineman_id': 1,
        'lineman': {
          '$toString': '$lineman_id'
        },
        'linemanname': 1,
        'finisheddate': 1,
        'startdate': 1,
        'totalamount': 1,
        'lineno': 1,
        'lastreceipt': '$lastreceipt.receiptdate',
        'collected': {
          '$ifNull': [
            '$joined.collected', 0
          ]
        },
        'balance': {
          '$subtract': [
            '$totalamount', {
              '$ifNull': [
                '$joined.collected', 0
              ]
            }
          ]
        },
        'receiptdateadded': {
          '$dateAdd': {
            'startDate': '$lastreceipt.receiptdate',
            'unit': 'month',
            'amount': 1
          }
        }
      }
    }, {
      '$match': {
        'balance': {
          '$eq': 0
        }
      }
    }, {
      '$project': {
        'loannumber': 1,
        'bookno': 1,
        'document': 1,
        'customer': 1,
        'city': 1,
        'lineman_id': 1,
        'lineman': 1,
        'linemanname': 1,
        'finisheddate': 1,
        'startdate': 1,
        'totalamount': 1,
        'lineno': 1,
        'lastreceipt': 1,
        'collected': 1,
        'balance': 1,
        'receiptdateadded': 1,
        'incentivepercentage': {
          '$cond': {
            'if': {
              '$lte': [
                '$receiptdateadded', '$finisheddate'
              ]
            },
            'then': 1,
            'else': 0.5
          }
        }
      }
    },
    {
      '$match': {
        'lineman': {
          '$eq': cityid
        }
      }
    },
  ])
  res.send(weekend)
}
//currentweekgivenmoneyaccountdetails//
module.exports.getCurrentWeekGiven=async(req,res)=>{
  const cityid = req.query['city_id'];
  const currentweek=await pendingloanModel.aggregate([
    {
      '$match': {
          '$and': [
              {
                  'givendate': {
                      '$gt': new Date(req.query['fromdate'])
                  }
              }, {
                  'givendate': {
                      '$lte': new Date(req.query['todate'])
                  }
              }
          ]
      }
  }, {
      '$project': {
          'loannumber': 1, 
          'startdate': 1, 
          'givendate': 1, 
          'finisheddate': 1, 
          'customer': 1, 
          'bookno': 1, 
          'city': 1, 
          'givenamount': 1, 
          'documentamount': 1, 
          'interestamount': 1, 
          'totalamount': 1, 
          'weekcount': 1, 
          'dueamount': 1, 
          'lineno': 1, 
          'linemanname': 1,
          'lineman': {
            '$toString': '$lineman_id'
          }
      }
  },
  {
    '$match': {
      'lineman': {
        '$eq': cityid
      }
    }
  },
  ])
  res.send(currentweek);
}

//company
module.exports.getCompany = async (req, res) => {
  const company = await companyModel.aggregate([

    {
      '$project': {
        'companyname': 1
      }
    }

  ])
  res.send(company)
}

//all loan
module.exports.getLoannumbers = async (req, res) => {
  const cityid = req.query['city_id'];
  const loannumbers = await pendingloanModel.find({ 'cityid': { $eq: cityid } })
  res.send(loannumbers)
}

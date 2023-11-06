const cityNameModel = require("../models/cityNameModel")
const lineModel = require("../models/lineModel")
const loanModel = require("../models/loanModel")

//all city
module.exports.getCityNames=async(req,res)=>{
    const cityNames=await cityNameModel.aggregate(
      [
        {
          '$lookup': {
            'from': 'linetables', 
            'localField': 'citylineno', 
            'foreignField': 'lineno', 
            'as': 'joined'
          }
        }, {
          '$unwind': {
            'path': '$joined', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            '_id': 1, 
            'cityname': 1, 
            'citylineno': 1, 
            'linename': '$joined.linename'
          }
        }
      ]
    )
    res.send(cityNames)
}

//get citymaxcode
/*module.exports.getMaxCityCode=async(req,res)=>{
    const maxcode=await cityNameModel.aggregate([
        {
          "$group": {
            "_id": null,
            "maxCode": { $max: '$citycode' },
          },
        },
        {
          "$project": {
            "_id": 0,
          },
        },
      ]);
      res.send(maxcode)
}*/
//create city
module.exports.saveCityNames=(req,res)=>{
    const citynamesdetails=new cityNameModel({
        cityname:req.body.cityname,
        citylineno:req.body.citylineno
    })
    cityNameModel.create(citynamesdetails)
    .then((data)=>{
    console.log("Saved SuccessFully");
    res.status(201).send(data)
    })
    .catch((err)=>{
        console.log(err);
        res.send({error:err,msg:"somthing went wrong"})
    })
}
//update City
module.exports.updateCityNames=(req,res)=>{
  const { id } = req.params 
    cityNameModel.findByIdAndUpdate(id,{cityname:req.body.cityname,citylineno:req.body.citylineno})
    .then(()=> res.send("Updated Successfully"))
    .catch((err)=>{
        console.log(err);
        res.send({error:err,msg:"somthing went wrong"})
    })
}
//Delete city
module.exports.deleteCityNames=(req,res)=>{
    const {id}=req.params
    cityNameModel.findByIdAndDelete(id)
    .then(()=> res.send("Deleted Successfully"))
    .catch((err)=>{
        console.log(err);
        res.send({error:err,msg:"somthing went wrong"})
    })
}


//Total Ledger Report//
module.exports.totalLedger=async(req,res)=>{
 const Ledger=await loanModel.aggregate(
  [
    {
      '$lookup': {
        'from': 'loantables', 
        'let': {
          'lineno': '$lineno'
        }, 
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$lineno', '$$lineno'
                    ]
                  }, {
                    '$lte': [
                      '$startdate', new Date('Mon, 06 Nov 2023 00:00:00 GMT')
                    ]
                  }
                ]
              }
            }
          }, {
            '$group': {
              '_id': {
                'lineno': '$lineno', 
                'lineman_id': '$lineman_id'
              }, 
              'totalamountbefore': {
                '$sum': '$totalamount'
              }, 
              'countbefore': {
                '$sum': 1
              }
            }
          }
        ], 
        'as': 'loansub'
      }
    }, {
      '$unwind': {
        'path': '$loansub', 
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
                      '$receiptdate', new Date('Mon, 06 Nov 2023 00:00:00 GMT')
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
          }
        ], 
        'as': 'receiptbefore'
      }
    }, {
      '$unwind': {
        'path': '$receiptbefore', 
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
                      '$receiptdate', new Date('Mon, 13 Nov 2023 00:00:00 GMT')
                    ]
                  }
                ]
              }
            }
          }, {
            '$group': {
              '_id': '$loannumber', 
              'collectedafter': {
                '$sum': '$collectedamount'
              }
            }
          }
        ], 
        'as': 'receiptafter'
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
                      '$receiptdate', new Date('Mon, 13 Nov 2023 00:00:00 GMT')
                    ]
                  }, {
                    '$gte': [
                      '$receiptdate', new Date('Mon, 06 Nov 2023 00:00:00 GMT')
                    ]
                  }
                ]
              }
            }
          }, {
            '$group': {
              '_id': '$loannumber', 
              'collectedbetween': {
                '$sum': '$collectedamount'
              }
            }
          }
        ], 
        'as': 'receiptbetween'
      }
    }, {
      '$unwind': {
        'path': '$receiptafter', 
        'includeArrayIndex': 'string', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$receiptbetween', 
        'includeArrayIndex': 'string', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'loannumber': 1, 
        'lineman_id': 1, 
        'lineno': 1, 
        'totalamount': 1, 
        'dueamount': 1, 
        'collectedamountbefore': {
          '$ifNull': [
            '$receiptbefore.collectedbefore', 0
          ]
        }, 
        'collectedamountafter': {
          '$ifNull': [
            '$receiptafter.collectedafter', 0
          ]
        }, 
        'collectedamountbetween': {
          '$ifNull': [
            '$receiptbetween.collectedamountbetween', 0
          ]
        }, 
        'weekcount': 1, 
        'addFields': {
          'daysCount': {
            '$add': [
              {
                '$round': {
                  '$divide': [
                    {
                      '$subtract': [
                        new Date('Mon, 06 Nov 2023 00:00:00 GMT'), '$startdate'
                      ]
                    }, 86400000 * 7
                  ]
                }
              }, 1
            ]
          }, 
          'daysCountafter': {
            '$add': [
              {
                '$round': {
                  '$divide': [
                    {
                      '$subtract': [
                        new Date('Mon, 13 Nov 2023 00:00:00 GMT'), '$startdate'
                      ]
                    }, 86400000 * 7
                  ]
                }
              }, 1
            ]
          }
        }, 
        'totalamountbefore': {
          '$ifNull': [
            '$loansub.totalamountbefore', 0
          ]
        }, 
        'countbefore': '$loansub.countbefore'
      }
    }, {
      '$project': {
        'loannumber': 1, 
        'lineman_id': 1, 
        'lineno': 1, 
        'totalamount': 1, 
        'dueamount': 1, 
        'collectedamountbetween': 1, 
        'totalamountbefore': 1, 
        'countbefore': 1, 
        'pendingamountbefore': {
          '$subtract': [
            {
              '$multiply': [
                '$dueamount', '$addFields.daysCount'
              ]
            }, '$collectedamountbefore'
          ]
        }, 
        'pendingamountafter': {
          '$subtract': [
            {
              '$multiply': [
                '$dueamount', '$addFields.daysCountafter'
              ]
            }, '$collectedamountafter'
          ]
        }
      }
    }, {
      '$group': {
        '_id': {
          'lineno': '$lineno', 
          'lineman_id': '$lineman_id', 
          'totalamountbefore': '$totalamountbefore', 
          'countbefore': '$countbefore'
        }, 
        'pendingbefore': {
          '$sum': '$pendingamountbefore'
        }, 
        'pendingafter': {
          '$sum': '$pendingamountafter'
        }, 
        'totalafter': {
          '$sum': '$totalamount'
        }, 
        'collectedbetween': {
          '$sum': '$collectedamountbetween'
        }, 
        'countafter': {
          '$sum': 1
        }
      }
    }, {
      '$replaceRoot': {
        'newRoot': {
          '$mergeObjects': [
            {
              'lineno': '$_id.lineno', 
              'lineman_id': '$_id.lineman_id', 
              'totalamountbefore': '$_id.totalamountbefore', 
              'countbefore': '$_id.countbefore'
            }, '$$ROOT'
          ]
        }
      }
    }, {
      '$lookup': {
        'from': 'linetables', 
        'localField': 'lineno', 
        'foreignField': 'lineno', 
        'as': 'linesub'
      }
    }, {
      '$unwind': {
        'path': '$linesub', 
        'includeArrayIndex': 'string', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'linemantables', 
        'localField': 'lineman_id', 
        'foreignField': '_id', 
        'as': 'linemansub'
      }
    }, {
      '$unwind': {
        'path': '$linemansub', 
        'includeArrayIndex': 'string', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'lineno': 1, 
        'lineman_id': 1, 
        'totalamountbefore': 1, 
        'countbefore': 1, 
        'totalamountafter': 1, 
        'countafter': 1, 
        'pendingbefore': 1, 
        'pendingafter': 1, 
        'collectedbetween': 1, 
        'linename': '$linesub.linename', 
        'linemanname': '$linemansub.linemanname'
      }
    }
  ]
 ) 
 res.send(Ledger);
}
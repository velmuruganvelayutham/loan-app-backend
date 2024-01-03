const cityNameModel = require("../models/cityNameModel")
const lineModel = require("../models/lineModel")
const loanModel = require("../models/loanModel")

//all city
module.exports.getCityNames = async (req, res) => {
  const cityNames = await cityNameModel.aggregate(
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
module.exports.saveCityNames = (req, res) => {
  const citynamesdetails = new cityNameModel({
    cityname: req.body.cityname,
    citylineno: req.body.citylineno
  })
  cityNameModel.create(citynamesdetails)
    .then((data) => {
      console.log("Saved SuccessFully");
      res.status(201).send(data)
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}
//update City
module.exports.updateCityNames = (req, res) => {
  const { id } = req.params
  cityNameModel.findByIdAndUpdate(id, { cityname: req.body.cityname, citylineno: req.body.citylineno })
    .then(() => res.send("Updated Successfully"))
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}
//Delete city
module.exports.deleteCityNames = (req, res) => {
  const { id } = req.params
  cityNameModel.findByIdAndDelete(id)
    .then(() => res.send("Deleted Successfully"))
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}


//Total Ledger Report//
module.exports.totalLedger = async (req, res) => {
  const Ledger = await loanModel.aggregate(
    [
      {
        '$lookup': {
          'from': 'loantables',
          'let': {
            'lineno': '$lineno',
            'loannumber': '$loannumber'
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
                    },
                    {
                      '$eq': [
                        '$loannumber', '$$loannumber'
                      ]
                    },
                    {
                      '$lt': [
                        '$startdate', new Date(req.query['fromdate'])
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
                        '$receiptdate', new Date(req.query['todate'])
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
                        '$receiptdate', new Date(req.query['todate'])
                      ]
                    }, {
                      '$gte': [
                        '$receiptdate', new Date(req.query['fromdate'])
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
      },
      {
        '$lookup': {
          'from': 'receipttables',
          'let': {
            'loannumber': '$loannumber',
            'dueamount': '$dueamount'
          },
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$and': [
                    {
                      '$eq': [
                        '$loannumber', '$$loannumber',
                      ]
                    }, {
                      '$lte': [
                        '$receiptdate', new Date(req.query['todate'])
                      ]
                    }, {
                      '$gte': [
                        '$receiptdate', new Date(req.query['fromdate'])
                      ]
                    },
                    {
                      '$gt': ['$collectedamount', "$$dueamount"]
                    }
                  ]
                }
              }
            }, {
              '$group': {
                '_id': '$loannumber',
                'collectedless': {
                  '$sum': '$collectedamount'
                }
              }
            }
          ],
          'as': 'receiptless'
        }
      },

      {
        '$unwind': {
          'path': '$receiptless',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': true
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
                        '$loannumber', '$$loannumber',
                      ]
                    }, {
                      '$lte': [
                        '$receiptdate', new Date(req.query['todate'])
                      ]
                    }, {
                      '$gte': [
                        '$receiptdate', new Date(req.query['fromdate'])
                      ]
                    }
                  ]
                }
              }
            }, {
              '$group': {
                '_id': '$loannumber',
                'collectedmore': {
                  '$sum': 0
                }
              }
            }
          ],
          'as': 'receiptmore'
        }
      },
      {
        '$unwind': {
          'path': '$receiptmore',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': true
        }
      },

      //Not Running---//
      {
        '$lookup': {
          'from': 'loantables',
          'let': {
            'lineno': '$lineno',
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
                        '$lineno', '$$lineno'
                      ]
                    }, {
                      '$eq': [
                        '$loannumber', '$$loannumber'
                      ]
                    }, {
                      '$lte': [
                        '$startdate', new Date(req.query['notrundate'])
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
                'totalamountloan': {
                  '$sum': '$totalamount'
                },
                'countloan': {
                  '$sum': 1
                }
              }
            }, {
              '$addFields': {
                'daysCountnotrunning': {
                  '$add': [
                    {
                      '$round': {
                        '$divide': [
                          {
                            '$subtract': [
                              new Date(req.query['notrundate']), '$$startdate'
                            ]
                          }, 86400000 * 7
                        ]
                      }
                    }, 1
                  ]
                }
              }
            }
          ],
          'as': 'notrunningloan'
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
                        '$receiptdate', new Date(req.query['notrundate'])
                      ]
                    }
                  ]
                }
              }
            }, {
              '$group': {
                '_id': {
                  'loanumber': '$loannumber'
                },
                'collectedamount': {
                  '$sum': '$collectedamount'
                }
              }
            }
          ],
          'as': 'notreceipt'
        }
      },
      {
        '$unwind': {
          'path': '$notrunningloan',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$unwind': {
          'path': '$notreceipt',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': true
        }
      },
      //Not Running//
      {
        '$project': {
          'loannumber': 1,
          'lineman_id': 1,
          'lineno': 1,
          'checkfinished':{'$cond': {
            'if': {
              '$lt': [
                '$finisheddate', new Date(req.query['fromdate'])
              ]
            },
            'then':1 ,
            'else': 0
          }},
          'totalamount': 1,
          'dueamount': 1,
          'weekcount':1,
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
              '$receiptbetween.collectedbetween', 0
            ]
          },
          'collectedless': {
            '$ifNull': [
              '$receiptless.collectedless', 0
            ]
          },

          'collectedmore': { '$ifNull': ["$receiptmore.collectedmore", "$dueamount"] },
          'weekcount': 1,
          'addFields': {
            'daysCount': {
              '$add': [
                {
                  '$round': {
                    '$divide': [
                      {
                        '$subtract': [
                          new Date(req.query['fromdate']), '$startdate'
                        ]
                      }, 86400000 * 7
                    ]
                  }
                },
              ]
            },
            'daysCountafter': {
              '$add': [
                {
                  '$round': {
                    '$divide': [
                      {
                        '$subtract': [
                          new Date(req.query['todate']), '$startdate'
                        ]
                      }, 86400000 * 7
                    ]
                  }
                },
              ]
            },
            'daysCountbetween': {
              '$add': [
                {
                  '$round': {
                    '$divide': [
                      {
                        '$subtract': [
                          new Date(req.query['todate']), new Date(req.query['fromdate'])
                        ]
                      }, 86400000 * 7
                    ]
                  }
                },
              ]
            }
          },
          'totalamountbefore': {
            '$ifNull': [
              '$loansub.totalamountbefore', 0
            ]
          },
          'countbefore': { '$ifNull': ['$loansub.countbefore', 0] },
          //Not running--//
          'daysCountnotrunning': '$notrunningloan.daysCountnotrunning',
          'receiptpendingweek': {
            '$subtract': [
              '$notrunningloan.daysCountnotrunning', {
                '$divide': [
                  {
                    '$ifNull': [
                      '$notreceipt.collectedamount', 0
                    ]
                  }, '$dueamount'
                ]
              }
            ]
          },
          'notrunningloan': {
            '$ifNull': [
              '$notrunningloan.totalamountloan', 0
            ]
          },
          'notrunningcount': {
            '$ifNull': [
              '$notrunningloan.countloan', 0
            ]
          },
          'notreceiptcollected': {
            '$ifNull': [
              '$notreceipt.collectedamount', 0
            ]
          },
          //Running and not running between dates//
          'notrunningloanamountdates': {
            '$cond': {
              'if': {
                '$gt': [
                  '$receiptbetween.collectedbetween', 0
                ]
              },
              'then': 0,
              'else': '$totalamount'
            }
          },
          'runningloanamountdates': {
            '$cond': {
              'if': {
                '$gt': [
                  '$receiptbetween.collectedbetween', 0
                ]
              },
              'then': '$totalamount',
              'else': 0
            }
          },
          'notrunningcountdates': {
            '$cond': {
              'if': {
                '$gt': [
                  '$receiptbetween.collectedbetween', 0
                ]
              },
              'then': 0,
              'else': 1
            }
          },
          'runningcountdates': {
            '$cond': {
              'if': {
                '$gt': [
                  '$receiptbetween.collectedbetween', 0
                ]
              },
              'then': 1,
              'else': 0
            }
          }

        }
      }, {
        '$project': {
          'loannumber': 1,
          'lineman_id': 1,
          'lineno': 1,
          'checkfinished':1,
          'totalamount': { $subtract: ['$totalamount', "$collectedamountafter"] },
          'dueamount': 1,
          'weekcount':1,
          'collectedamountbetween': 1,
          'collectedless':{
            '$cond': {
              'if': {
                '$gt': [
                  '$collectedless', '$dueamount'
                ]
              },
              'then':{$subtract: ['$collectedless', "$dueamount"]} ,
              'else': 0
            }
          } ,
          'collectedmore':{'$multiply': [
            '$collectedmore', '$addFields.daysCountbetween'
          ]},
          'totalamountbefore': { $subtract: ['$totalamountbefore', "$collectedamountbefore"] },
          'countbefore': 1,
          'pendingamountbefore': {
            '$subtract': [
              {
                '$multiply': [
                  '$dueamount', {
                    '$cond': {
                      'if': {
                        '$lt': [
                          '$weekcount', '$addFields.daysCount'
                        ]
                      },
                      'then':"$weekcount" ,
                      'else': '$addFields.daysCount'
                    }
                  }
                ]
              }, '$collectedamountbefore'
            ]
          },

          'pendingamountafter': {
            '$subtract': [
              {
                '$multiply': [
                  '$dueamount', {
                    '$cond': {
                      'if': {
                        '$lt': [
                          '$weekcount', '$addFields.daysCountafter'
                        ]
                      },
                      'then':"$weekcount" ,
                      'else': '$addFields.daysCountafter'
                    }
                  }
                ]
              }, '$collectedamountafter'
            ]
          },
          //not running//
          'notrunningloancount': {
            '$cond': { 'if': { '$gte': ["$receiptpendingweek", 4] }, 'then': "$notrunningcount", 'else': 0 }
          },
          'notrunningloanpending': {
            '$cond': { 'if': { '$gte': ["$receiptpendingweek", 4] }, 'then': { '$subtract': ["$notrunningloan", "$notreceiptcollected"] }, 'else': 0 }
          },
          //Running and not running between dates//
          'notrunningloanpendingdates': {
            '$cond': {
              'if': {
                '$gt': [
                  '$notrunningloanamountdates', 0
                ]
              },
              'then': {
                '$subtract': [
                  '$notrunningloanamountdates', '$collectedamountafter'
                ]
              },
              'else': 0
            }
          },
          'runningloanpendingdates': {
            '$cond': {
              'if': {
                '$gt': [
                  '$runningloanamountdates', 0
                ]
              },
              'then': {
                '$subtract': [
                  '$runningloanamountdates', '$collectedamountafter'
                ]
              },
              'else': 0
            }
          },
          'notrunningcountdates': 1,
          'runningcountdates': 1
        }
      },
      {
        '$project': {
          'loannumber': 1,
          'lineman_id': 1,
          'lineno': 1,
          'checkfinished':1,
          'totalamount': 1,
          'dueamount': 1,
          'weekcount':1,
          'collectedamountbetween': 1,
          'collectedless':{ '$cond': { 'if': { '$gt': ["$pendingamountbefore", 0] }, 'then': "$collectedless", 'else': 0 } },
          'collectedmore': {
            '$cond': { 'if':
              { '$gte': 
                ["$pendingamountafter", 0] }, 
                      'then':{'$cond':{'if':{
                        '$lt':["$pendingamountafter", '$collectedmore']},
                        'then':"$pendingamountafter",'else': "$collectedmore"      
                                      }}, 
                      'else': 0 }
          },
          'totalamountbefore': 1,
          'countbefore': 1,
          'pendingamountbefore': {
            '$cond': { 'if': { '$gt': ["$pendingamountbefore", 0] }, 'then': "$pendingamountbefore", 'else': 0 }
          },

          'pendingamountafter': { '$cond': { 'if': { '$gt': ["$pendingamountafter", 0] }, 'then': "$pendingamountafter", 'else': 0 } },
          //not running//
          'notrunningloancount': 1,
          'notrunningloanpending': 1,
          //Running and not running between dates//
          'notrunningloanpendingdates': 1,
          'runningloanpendingdates': 1,
          'notrunningcountdates': 1,
          'runningcountdates': 1
        }
      },
      
      {
        '$group': {
          '_id': {
            'lineno': '$lineno',
            'lineman_id': '$lineman_id'
          },
          'totalamountbefore':
            { '$sum': "$totalamountbefore" },

            'countbefore':{'$sum': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$totalamountbefore', 0
                  ]
                },
                'then': 0,
                'else': 1
              }
            }},

          //currently finished accounts//
          'countfinishedbefore': {
            '$sum': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$totalamountbefore', 0
                  ]
                },
                'then': 1,
                'else': 0
              }
            }
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
          'collectedless': {
            '$sum': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$totalamount', 0
                  ]
                },
                'then': 0,
                'else':{
              '$cond': {
                'if': {
                  '$eq': [
                    '$checkfinished', 1
                  ]
                },
                'then': 0,
                'else':'$collectedless'
              }
            }
              }
            }
          },
          'collectedmore': {
            '$sum': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$totalamount', 0
                  ]
                },
                'then': 0,
                'else':{
              '$cond': {
                'if': {
                  '$eq': [
                    '$checkfinished', 1
                  ]
                },
                'then': 0,
                'else':'$collectedmore'
              }
            }
              }
            }
          }
          ,
          //count after with totalamount zero is finished account/
          'countafter': {
            '$sum': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$totalamount', 0
                  ]
                },
                'then': 0,
                'else': 1
              }
            }
          },
          //currently finished accounts//
          'countfinished': {
            '$sum': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$totalamount', 0
                  ]
                },
                'then': 1,
                'else': 0
              }
            }
          },

          //not running---//
          'notrunningloancount': {
            '$sum': '$notrunningloancount'
          },

          'notrunningloanpending': {
            '$sum': '$notrunningloanpending'
          },
          //Running and not running between dates//
          'notrunningloanpendingdates': {
            '$sum': '$notrunningloanpendingdates'
          },
          'runningloanpendingdates': {
            '$sum': '$runningloanpendingdates'
          },
          'notrunningcountdates': {
            '$sum': '$notrunningcountdates'
          },
          'runningcountdates': {
            '$sum': '$runningcountdates'
          }
        }
      }, {
        '$replaceRoot': {
          'newRoot': {
            '$mergeObjects': [
              {
                'lineno': '$_id.lineno',
                'lineman_id': '$_id.lineman_id'
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
          'countfinishedbefore':1,
          'totalafter': 1,
          'countafter': 1,
          'countfinished': 1,
          'pendingbefore': 1,
          'pendingafter': 1,
          'collectedbetween': 1,
          'collectedless': 1,
          'collectedmore': 1,
          'notrunningloancount': 1,
          'notrunningloanpending': 1,
          'notrunningloanpendingdates': 1,
          'runningloanpendingdates': 1,
          'notrunningcountdates': 1,
          'runningcountdates': 1,
          'linename': '$linesub.linename',
          'linemanname': '$linemansub.linemanname'
        }
      },
      {

        '$sort': {
          'lineno': 1
        }
      }
    ]
  )
  res.send(Ledger);
}
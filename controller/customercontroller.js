const customerModel = require("../models/customerModel")
const receiptModel = require("../models/receiptModel")
const loanModel = require("../models/loanModel");
const pendingloanModel = require("../models/loanPendingModelView");
const loanPendingModelView = require("../models/loanPendingModelView");
//all Customers
module.exports.getCustomers = async (req, res) => {
  const customers = await customerModel.find()
  res.send(customers)

}
///all customer with city details
module.exports.getCustomerWithCity = async (req, res) => {
  const resview = await customerModel.aggregate([
    {
      $lookup:
      {
        from: "citytables",
        localField: "city",
        foreignField: "_id",
        as: "custcityname"
      },
    },
    {
      $project:
      {
        "customer": 1,
        "mobileno": 1,
        "fathername": 1,
        "address": 1,
        "work": 1,
        "relationtype": 1,
        "cityname": "$custcityname.cityname",
        "city_id": "$custcityname._id",
        "lineno": "$custcityname.citylineno"
      },
    },
    {
      $unwind: "$cityname"
    },
    {
      $unwind: "$city_id"
    }
  ]);
  res.send(resview);
}
//create customer
module.exports.saveCustomer = (req, res) => {
  const customerdetails = new customerModel({
    customer: req.body.customer,
    mobileno: req.body.mobileno,
    city: req.body.cityid,
    fathername: req.body.fathername,
    address: req.body.address,
    work: req.body.work,
    relationtype: req.body.relationtype

  })
  customerModel.create(customerdetails)
    .then((data) => {
      console.log("Saved Successfully");
      res.status(201).send(data)
    }).catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}
//update customer
module.exports.updateCustomer = (req, res) => {
  const { id } = req.params
  //const {customer}=req.body
  customerModel.findByIdAndUpdate(id, {
    customer: req.body.customer, mobileno: req.body.mobileno, city: req.body.cityid,
    fathername: req.body.fathername, address: req.body.address, work: req.body.work, relationtype: req.body.relationtype
  })
    .then(() => res.send("Updated Successfully"))
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}
//Delete customer
module.exports.deleteCustomer = (req, res) => {
  const { id } = req.params
  /*const custres = loanModel.findById(id)
    .then((res.send(custres)))
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })*/
  customerModel.findByIdAndDelete(id)
  .then(()=> res.send("Deleted Successfully"))
  .catch((err)=>{
      console.log(err);
      res.send({error:err,msg:"somthing went wrong"})
  })
}

//Receipt Section
//Get Pending Loans//
module.exports.getPendingLoan = async (req, res) => {
  const cityid = req.query['cityid'];
  //const resview=await pendingloanModel.find();
  const resview = await pendingloanModel.aggregate(
    [
      {
        $lookup: {
          from: 'receipttables',
          localField: 'loannumber',
          foreignField: 'loannumber',
          as: 'joined'
        },
      },

      {
        $match: {
          "joined.receiptdate": { $not: { $eq: new Date(req.query['receiptdate']) } }
        }
      }
      ,
      {
        $unwind: {
          path: '$joined',
          includeArrayIndex: 'string',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            loannumber: '$loannumber',
            customer_id: '$customer_id',
            totalamount: '$totalamount',
            customer: "$customer",
            dueamount: "$dueamount",
            city: "$city",
            cityid: "$cityid"
          },
          collected: { $sum: '$joined.collectedamount' }
        }
      },

      {
        $project: {
          loannumber: 1,
          customer_id: 1,
          customer: 1,
          totalamount: 1,
          dueamount: 1,
          city: 1,
          collected: 1,
          cityid: 1,
          "pending": { $subtract: ["$_id.totalamount", "$collected"] }
        }
      },

      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                customer: '',
                loannumber: '$_id.loannumber',
                totalamount: '$_id.totalamount',
                dueamount: '$_id.dueamount',
                city: '$_id.city',
                cityid: '$_id.cityid',
                check: false,
                amount: 0,
                weak: 0
              },
              '$$ROOT'
            ]
          }
        }
      },

      {
        $match: {
          $and: [
            { cityid: { $eq: cityid } },
            { pending: { $gt: 0 } }
          ]
        }
      },
      {
        $sort: { loannumber: 1 }
      }

    ]);
  res.send(resview);
}

module.exports.saveReceipt = (req, res) => {
  let items = req.body.receiptdata.map(item => {
    if (item.check) {
      return {
        loannumber: item.loannumber,
        receiptdate: req.body.receiptdate,
        customer_id: item["_id"].customer_id,
        weekno: item.weak,
        collectedamount: item.amount
      }
    }

  })
  receiptModel.create(items)
    .then((data) => {
      console.log("Saved Successfully");
      res.status(201).send(data)
    }).catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "somthing went wrong" })
    })
}

///All Loan//
module.exports.getLoanDetails=async(req,res)=>{
  const loan=await loanPendingModelView.find()
  res.send(loan);
}


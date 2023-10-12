const LedgerModel=require("../models/ledgerModel");
const loanModel = require("../models/loanModel")
module.exports.getLeger=async(req,res)=>{
    const ledger=await loanModel.find()
    res.send(ledger)
}
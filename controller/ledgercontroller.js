const LedgerModel=require("../models/ledgerModel");
module.exports.getLeger=async(req,res)=>{
    const ledger=await LedgerModel.find()
    res.send(ledger)
}
const express=require('express')
const router=express.Router()
const{getLineManNames,deleteLineManNames,updateLineManNames,saveLineManNames,getMaxLineManCode,
    getMaxLoanCode,saveLoan,getLineNames,getOldLoanRef,getLedger,getCheckingDetails}=require("../controller/lineManNamecontroller");
router.get("/linemancreate/get",getLineManNames);
router.post("/linemancreate/save",saveLineManNames);
router.put("/linemancreate/update/:linemancode",updateLineManNames);
router.delete("/linemancreate/delete/:linemancode",deleteLineManNames)
router.get("/linemancreate/get/max",getMaxLineManCode);
//loan section//
router.get("/loancreate/get/max",getMaxLoanCode);
router.post("/loancreate/save",saveLoan);
router.get("/loancreate/get/oldLoanRef",getOldLoanRef);
//line //
router.get("/linemancreate/get/lines",getLineNames);
//ledger
router.get("/ledger/get",getLedger);
//Line checking
router.get("/loan/checkingdetails",getCheckingDetails)

module.exports=router
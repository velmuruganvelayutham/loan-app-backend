const express=require('express')
const router=express.Router()
const{getLineManNames,deleteLineManNames,updateLineManNames,saveLineManNames,
    getMaxLoanCode,saveLoan,getLineNames,getOldLoanRef,getLedger,getCheckingDetails,
    getLoannumbers,updateLoan,getPreviousweekDetails,getCompany}=require("../controller/lineManNamecontroller");
router.get("/linemancreate/get",getLineManNames);
router.post("/linemancreate/save",saveLineManNames);
router.put("/linemancreate/update/:id",updateLineManNames);
router.delete("/linemancreate/delete/:id",deleteLineManNames)
//router.get("/linemancreate/get/max",getMaxLineManCode);
//loan section//
router.get("/loancreate/get/max",getMaxLoanCode);
router.post("/loancreate/save",saveLoan);
router.put("/loancreate/update",updateLoan);
router.get("/loancreate/get/oldLoanRef",getOldLoanRef);
router.get("/loancreate/get",getLoannumbers)
//line //
router.get("/linemancreate/get/lines",getLineNames);
//ledger
router.get("/ledger/get",getLedger);
//Line checking
router.get("/loan/checkingdetails",getCheckingDetails)
//previousweekcollection//
router.get("/loan/previousweekdetails",getPreviousweekDetails)
//companyname//
router.get("company/get",getCompany);
module.exports=router
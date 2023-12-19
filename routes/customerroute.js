const express=require('express')
const router=express.Router()
const {getCustomers,saveCustomer,updateCustomer,deleteCustomer, getCustomerWithCity,
    getPendingLoan,saveReceipt,getLoanDetails,getReceipt}=require("../controller/customercontroller")
router.get("/get",getCustomers);
router.get("/get/view",getCustomerWithCity)
router.post("/save",saveCustomer)
router.put("/update/:id",updateCustomer)
router.delete("/delete/:id",deleteCustomer)
//receipt section
router.get("/receipt/get/loanpending",getPendingLoan);
router.post("/receipt/save/details",saveReceipt);
router.post("/receipt/get",saveReceipt);
//loan details//
router.get("/loan/getDetails",getLoanDetails)
module.exports=router

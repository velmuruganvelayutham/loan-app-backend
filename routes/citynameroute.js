const express=require('express')
const router=express.Router()
const{getCityNames,deleteCityNames,updateCityNames,saveCityNames,totalLedger}=require("../controller/cityNamecontroller");
router.get("/citycreate/get",getCityNames);
router.post("/citycreate/save",saveCityNames);
router.put("/citycreate/update/:id",updateCityNames);
router.delete("/delete/:id",deleteCityNames)

//Total Ledger Section//
router.get("/city/totalledger",totalLedger);

//router.get("/citycreate/get/max",getMaxCityCode);

module.exports=router
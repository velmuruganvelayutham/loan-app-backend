const express=require('express')
const router=express.Router()
const {getLeger}=require("../controller/ledgercontroller")
router.get("/ledger/get",getLeger);
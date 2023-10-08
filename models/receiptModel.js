const mongoose=require("mongoose")
const receiptSchema=new mongoose.Schema({
    receiptdate:{
        type:Date,
        required:true,
        default:Date.now
    },
    customer_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'customerModel'
    },
    loannumber:{
        type:Number,
        required:true,
        ref:'loanModel'
    },
    weekno:{
        type:Number,
        required:true
    },
    collectedamount:{
        type:Number,
        required:true
    }

})
module.exports=mongoose.model("ReceiptTable",receiptSchema)
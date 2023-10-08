const mongoose=require("mongoose")
const customerSchema=new mongoose.Schema({
    customer:{
        type:String,
        required:true
    },
    mobileno:{
        type:String,
        required:true
    },
    city:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'cityNameModel'
    },
    fathername:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    work:{
        type:String,
        required:false
    },
    relationtype:{
        type:Number,
        required:true
    }

})
module.exports=mongoose.model("CustomerTable",customerSchema)
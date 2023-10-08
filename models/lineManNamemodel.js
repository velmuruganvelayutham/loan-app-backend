const mongoose=require("mongoose")
const lineManNameSchema=new mongoose.Schema({
    linemancode:{
        type:Number,
        required:true,
        default:0
    },
    linemanname:{
        type:String,
        required:true
    },
    mobileno:{
        type:String
    }

})
module.exports=mongoose.model("LineManTable",lineManNameSchema)
const mongoose=require("mongoose")
const lineManNameSchema=new mongoose.Schema({
    linemanname:{
        type:String,
        required:true
    },
    mobileno:{
        type:String
    }

})
module.exports=mongoose.model("LineManTable",lineManNameSchema)
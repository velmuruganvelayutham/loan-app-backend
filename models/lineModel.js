const mongoose=require("mongoose")
const lineNameSchema=new mongoose.Schema({
    linename:{
        type:String,
        required:true
    },
    lineno:{
        type:Number
    }

})
module.exports=mongoose.model("linetable",lineNameSchema)
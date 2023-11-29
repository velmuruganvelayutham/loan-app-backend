const mongoose=require("mongoose")
const companyNameSchema=new mongoose.Schema({
    companyname:{
        type:String,
        required:true
    }

})
module.exports=mongoose.model("CompanyTable",companyNameSchema)
const mongoose=require("mongoose")
const loanpendingschema=new mongoose.Schema({
    customer:{
        type:String,
        default:""
    },
    loannumber:{
        type:Number
    },
    totalamount:{
        type:Number
    },
    city:{
        type:String
    },
    cityid:{
        type:mongoose.Schema.Types.ObjectId,
        default:""
    },
    _id:mongoose.Schema.Types.ObjectId,
    collected:{
        type:Number
    },
    pending:{
        type:Number
    }
    

},{collection:'vw_loanpendingdetails',versionKey:false});
module.exports=mongoose.model('lineChecking',loanpendingschema);
const mongoose=require("mongoose")
const laonpendingschema=new mongoose.Schema({
    
    customer:{
        type:String
    },
    loannumber:{
        type:Number
    },
    dueamount:{
        type:Number
    },
    paidamount:{
        type:Number
    },
    totalamount:{
        type:Number
    },
    startdate:{
        type:Date
    },
    givendate:{
        type:Date
    },
    receipdate:{
        type:Date
    },
    collectedamount:{
        type:Number
    },
    _id:mongoose.Schema.Types.ObjectId,
    customer_id:{
        type:mongoose.Schema.Types.ObjectId
    },
    lineman_id:{
        type:mongoose.Schema.Types.ObjectId
    },
    weekcount:{
        type:Number
    },
    duedate:{
        type:Date
    },
    finisheddate:{
        type:Date
    },
    givenamount:{
        type:Number
    },
    documentamount:{
        type:Number
    },
    interestamount:{
        type:Number
    },
    totalamount:{
        type:Number
    },
    dueamount:{
        type:Number
    },
     paidamount:{
        type:Number
     },
     customer:{
        type:String,
        default:""
    },
    city:{
        type:mongoose.Schema.Types.ObjectId,
        default:""
    },
    address:{
        type:String,
        default:""
    },
    work:{
        type:String,
        default:""
    },
    fathername:{
        type:String,
        default:""
    },
    mobileno:{
        type:String,
        default:""
    },
    relationtype:{
        type:Number,
        default:0
    }

},{collection:'vw_ledger',versionKey:false});
module.exports=mongoose.model('Ledger',laonpendingschema);
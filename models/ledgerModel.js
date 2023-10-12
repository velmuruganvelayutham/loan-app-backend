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
    weekno:{
        type:Number
    },
    bookno:{
        type:Number
    },
    document:{
        type:String
    },
    cheque:{
        type:String
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
     customer:{
        type:String
    },
    city:{
        type:mongoose.Schema.Types.ObjectId
    },
    cityid:{
        type:String
    },
    fathername:{
        type:String
    },
    work:{
        type:String
    },
    address:{
        type:String
    },
    mobileno:{
        type:String
    },
    lineno:{
        type:String
    }

},{collection:'vw_ledger',versionKey:false});
module.exports=mongoose.model('Ledger',laonpendingschema);

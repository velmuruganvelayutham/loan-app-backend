const mongoose=require("mongoose")
const cityNameSchema=new mongoose.Schema({
    cityname:{
        type:String,
        required:true
    },
    citylineno:{
        type:Number,
        required:true
    }

})
module.exports=mongoose.model("CityTable",cityNameSchema)
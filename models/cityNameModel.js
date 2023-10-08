const mongoose=require("mongoose")
const cityNameSchema=new mongoose.Schema({
    cityname:{
        type:String,
        required:true
    },
    citylineno:{
        type:String
    }

})
module.exports=mongoose.model("CityTable",cityNameSchema)
const cityNameModel = require("../models/cityNameModel")

//all city
module.exports.getCityNames=async(req,res)=>{
    const cityNames=await cityNameModel.find()
    res.send(cityNames)
}

//get citymaxcode
/*module.exports.getMaxCityCode=async(req,res)=>{
    const maxcode=await cityNameModel.aggregate([
        {
          "$group": {
            "_id": null,
            "maxCode": { $max: '$citycode' },
          },
        },
        {
          "$project": {
            "_id": 0,
          },
        },
      ]);
      res.send(maxcode)
}*/
//create city
module.exports.saveCityNames=(req,res)=>{
    const citynamesdetails=new cityNameModel({
        cityname:req.body.cityname,
        citylineno:req.body.citylineno
    })
    cityNameModel.create(citynamesdetails)
    .then((data)=>{
    console.log("Saved SuccessFully");
    res.status(201).send(data)
    })
    .catch((err)=>{
        console.log(err);
        res.send({error:err,msg:"somthing went wrong"})
    })
}
//update City
module.exports.updateCityNames=(req,res)=>{
  const { id } = req.params 
    cityNameModel.findByIdAndUpdate(id,{cityname:req.body.cityname,citylineno:req.body.citylineno})
    .then(()=> res.send("Updated Successfully"))
    .catch((err)=>{
        console.log(err);
        res.send({error:err,msg:"somthing went wrong"})
    })
}
//Delete city
module.exports.deleteCityNames=(req,res)=>{
    const {id}=req.params
    cityNameModel.findByIdAndDelete(id)
    .then(()=> res.send("Deleted Successfully"))
    .catch((err)=>{
        console.log(err);
        res.send({error:err,msg:"somthing went wrong"})
    })
}
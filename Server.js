const express = require("express");
require("dotenv").config()
const routes=require("./routes/customerroute")
const routescity=require("./routes/citynameroute")
const routeslineman=require("./routes/linemanroute")

const cors=require("cors")

const app=express()
const bodyParser=require('body-parser')
const PORT=process.env.PORT || 1300

app.use(express.json())
app.use(bodyParser.urlencoded({limit:'10mb',extended:false}))


const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
      'DELETE',
      'PUT'
    ],
    allowedHeaders: [
      'Content-Type',
    ],
  };
  app.use(cors(corsOpts));

const mongoose=require('mongoose')

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true})
const db=mongoose.connection
db.on('error',error=>console.error(error))
db.once('open',()=>console.log('connected'))

app.use(routes);
app.use(routescity);
app.use(routeslineman);
//app.use('/city',routescity)
/*const fs = require('fs');
const routes_directory = require('path').resolve(__dirname) + '\\routes\\'; 
console.log(routes_directory);
fs.readdirSync(routes_directory).forEach(route_file => {
  try {
    app.use('/', require(routes_directory + route_file)());
  } catch (error) {
    console.log(`Encountered Error initializing routes from ${route_file}`);
    console.log(error);
  }
});*/

app.listen(PORT, console.log(`Server started on port ${PORT}`));

const mongoose = require('mongoose')


const mongooseServer= mongoose
.connect("mongodb://127.0.0.1:27017/AccountDataBase")
.then(()=>{ console.log("database connected")})
.catch((err)=>console.log("error occured"))

module.exports=mongooseServer
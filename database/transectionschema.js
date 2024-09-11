const mongoose = require('mongoose')

const TransectionSchema = new mongoose.Schema({
    sender:{
      type:String,required:true
    },
    recipient:{
      type:String,required:true
    },
 
    amount:{
       type:Number , required:true
      },
       date:{
        type:Date,default:Date.now
       }
 })

 const Transaction = mongoose.model("transectionHistoryData",TransectionSchema)
 module.exports=Transaction;

 
const mongoose = require('mongoose')


const userSchema=new mongoose.Schema({
    account_No:{
        type:String,
        
    },
    firstName:{
        type:String,
        
    },
    lastName:{
        type:String,
    },
    account_balance:{
        type:Number,
    },
    date: { type: Date, default: Date.now 
   },
});

const User=mongoose.model("userAccountData",userSchema)

module.exports=User;

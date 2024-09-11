var express = require("express")


const router = express.Router();

var User= require('../database/userschema.js')
var Transaction=require('../database/transectionschema.js')
var Connection = require('../database/connection.js')


//getting/ viewing all account

router.get("/", async (req,res)=>{
   
    try{
        const result = await User.find(); 
        // find method use to find data from database
        res.json(result);

        console.log("accounts are: ",result);
      }catch(error){
         console.error("Error fetching user:", error);
         res.status(500).json({ error: " Server Error" });
      }
    })

//getting all transaction

router.get("/transactions", async (req, res) => {
    try {
      const result = await Transaction.find();
      res.json(result);
      console.log("result", result);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  });
  
    // creating account
    
router.post("/",async(req,res)=>{

  try{
      const user= req.body;

      const useralradyexists = await User.findOne({account_No:user.account_No})
  if(useralradyexists){
     return res.status(400).json({ msg: "Account already available" });
}

//to store the data in scheama database....
          const result=await User.create({
          account_No:user.account_No,
          firstName:user.firstName,
          lastName:user.lastName,
          account_balance:user.account_balance,
       });
         console.log("result",+result);
         return res.status(201).json({msg:"New account created"})
       
      }catch(error){
       res.json({error:"error creating new account"})
      }
        })

   // viewing a perticular account
   
   router.get("/:account_No", async (req,res)=>{
    try{
         const {account_No}= req.params;
         const result = await User.findOne({account_No})
         console.log("result",result);
         res.json(result);
    }catch(error){
       console.error("Error in getting user:", error);
       res.json({ error: " database problem " });
    }
     })

  //updating account
  
  router.patch('/:account_No',async(req,res)=>{

    try{
     const {account_No}=req.params;
     const userdata=req.body;
     const result=await User.findOneAndUpdate({account_No},userdata,{new:true});
 
    res.json({msg:"account updated"})
    }catch(error){
       console.error("Error in getting user:", error);
       res.json({ error: "database problem" });
 
    }
 
  })

//sending money

router.patch('/:account_No/:Raccount_No/:money', async (req, res) => {
    const { account_No, Raccount_No } = req.params;
    const SendMoney = parseInt(req.params.money);
    const { account_balance } = req.body;
  
 try {
      const sender = await User.findOneAndUpdate({ account_No: account_No }, { $set: { account_balance: account_balance } }, { new: true });
      const recipient = await User.findOneAndUpdate({ account_No: Raccount_No }, {}, { new: true });
  
      if (!sender || !recipient) {
        return res.status(404).send('Sender or recipient not found');
      }
  
      if (sender && recipient && sender.account_balance >= SendMoney) {
        sender.account_balance -= SendMoney;
        recipient.account_balance += SendMoney;
  
        await sender.save();
        await recipient.save();

  // to store the details in the schemas..

        const transaction = new Transaction({
          sender: sender.account_No,
          recipient: recipient.account_No,
          amount: SendMoney,
        });
  
        await transaction.save();
  
        return res.send(`Deducted ${SendMoney} from account holder with account number ${account_No} and credited to another account`);
      } else {
        return res.send('Insufficient funds or sender/recipient not found');
      }
     }
  catch (error) {
      console.error(error);
      return res.send('some database error');
    }
  });

  // deleting account

 router.delete("/:account_No",async(req,res)=>{

    try{
     const {account_No}= req.params;
    const result=await User.findOneAndDelete({account_No})
    res.json({msg:"account deleted"})
    }catch(error){
       console.log("error in deelting user");
       res.json({ error: "Server Error" });
    }
  })

module.exports = router;

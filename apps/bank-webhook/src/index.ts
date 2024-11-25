const express = require('express');
const app = express();
import db from "@repo/db"

app.get("/",(req:any,res:any)=>{
    console.log("hi from /") 
})

app.post("/hdfcWebhook",async(req:any,res:any)=>{
    // ADD ZOD VALIDATION
    const paymentInformation = {
        token : req.body.token,
        userId : req.body.userId,
        amount : req.body.amount
    }
    // Update the txn amount in db

    const user = await db.user.findFirst({
        where:{
            id:paymentInformation.userId
        }
    });

    if(!user){
        return res.json({msg:"User not Exist !"})
    }

    // Update the Balance...
    await db.balance.update({
        where:{
            id:paymentInformation.userId
        },
        data:{
            userId:paymentInformation.userId,
            amount:{
                increment:paymentInformation.amount
            }
        }
    });

    await db.onRampTransaction.update({
        where:{
            token:paymentInformation.token
        },
        data:{
            status:"Success",
            
        }
    })

    res.status(200).json({msg:"captured!"})
})

app.listen(5000,()=>{
    console.log("Bank-Webhook Listening");
})
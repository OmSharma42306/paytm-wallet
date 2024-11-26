const express = require('express');
const app = express();
import db from "@repo/db"
import {z} from "zod"

app.post("/hdfcWebhook",async(req:any,res:any)=>{
    // ADD ZOD VALIDATION
   const paymentInformationSchema = z.object({
    token : z.string(),
    userId : z.number(),
    amount : z.number()
   })

   // validate request body data
   const parsedPaymentInformation = paymentInformationSchema.safeParse(
    req.body
   ) 
   
    if(!parsedPaymentInformation.success){
        return res.status(400).json({msg:"Invalid Inputs are Given!"});
    }
   
    const {token,userId,amount} = parsedPaymentInformation.data;

   // Update the txn amount in db

    // const user = await db.user.findFirst({
    //     where:{
    //         id:paymentInformation.userId
    //     }
    // });

    // if(!user){
    //     return res.json({msg:"User not Exist !"})
    // }

    // Update the Balance...
    try{
    await db.$transaction([
        db.balance.updateMany({
            where:{
                userId:userId,
            },
            data:{
                amount:{
                    increment:Number(amount)}
            }
        }),

        db.onRampTransaction.updateMany({
            where:{
                token:token
            },
            data:{
                status:"Success"
            }
        })

        ])
        res.status(200).json({msg:"captured!"})
    }catch(err){
        console.error(err);
        return res.status(411).json({msg:"Error While Processing Webhook"})
    }
    
    // await db.balance.update({
    //     where:{
    //         id:paymentInformation.userId
    //     },
    //     data:{
    //         userId:paymentInformation.userId,
    //         amount:{
    //             increment:paymentInformation.amount
    //         }
    //     }
    // });

    // await db.onRampTransaction.update({
    //     where:{
    //         token:paymentInformation.token
    //     },
    //     data:{
    //         status:"Success",
            
    //     }
    // })

   
})

app.listen(3003,()=>{
    console.log("Bank-Webhook Listening");
})
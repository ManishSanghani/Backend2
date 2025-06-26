import mongoose from "mongoose";

const subscripationSchema=new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId, //one who subscribing
        ref:"User"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,  //one to whom "subscriber" is subscribing
        ref:"User"
    }

},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscripationSchema)
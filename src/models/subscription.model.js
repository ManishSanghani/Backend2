import mongoose from "mongoose";

const subscripationSchema=new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId, //one who subscribing
        ref:"User"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User"
    }

},{timestamps:true})

const Subscription=mongoose.model("Subscription",subscripationSchema)
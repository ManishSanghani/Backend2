// require("dotenv").config({path:'./env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express"
import {app} from "./app.js"
// const app=express()
dotenv.config({ path: "./env" });
connectDB()
.then(()=>{
    // app.on("error", (error) => {
    //     console.error("Error connecting to MongoDB:", error);
    //     throw error; 
    //     // process.exit(1); // Uncomment if you want to exit on error
    // })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port:${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
    // process.exit(1);
})
/*  
import express from "express";
const app = express();
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${YOUTUBE}`)
        app.on("error",(error)=>{
            console.log("Error connecting to MongoDB:", error);
            throw error;
        })
         app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
})();

*/
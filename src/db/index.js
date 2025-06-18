import mongoose from "mongoose";
import { YOUTUBE } from "../constants.js";

const connectDB = async () => {
try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${YOUTUBE}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host} \n`);
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}


export default connectDB;   
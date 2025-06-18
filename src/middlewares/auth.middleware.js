// import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model.js";
import { Apierror } from "../utils/Apierror.js";
import jwt from "jsonwebtoken" 
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token=
        req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ","")
        // console.log("token",token);
         console.log("Authorization Header:", req.header("Authorization"));
         console.log("Token from cookies or header:", token);
        if(!token){
            throw new Apierror(401,"Unauthorized request")
        } 
        const decodetoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodetoken?._id).select("-password -refreshToken")
    
        if(!user) {
            throw new Apierror(401,"Invalid access Token")
        }
    
        req.user=user
        next()
    } catch (error) {
        throw new Apierror(401,error?.message || "Invalid access Token")
    } 
})
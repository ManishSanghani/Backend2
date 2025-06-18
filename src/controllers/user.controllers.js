import {asyncHandler} from "../utils/asyncHandler.js"
import { Apierror } from "../utils/Apierror.js";
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken"
import { access } from "fs";

const generateAccessandRefershTokens=async(userId)=>{
    try {
       const user=await User.findById(userId)
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()
        // console.log("accessToken",refreshToken )
       user.refreshToken=refreshToken
       await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new Apierror(500,"Something went wrong while generating referesh and access token")
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullname,username,email,password}=req.body 
    // console.log("emial",email);
    // console.log("username",username);

    if(
        [fullname,password,username,email].some((field)=>
            field?.trim()===""
        )){
        throw new Apierror(400,"All field are required ")
    }
    const existUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existUser){ 
        throw new Apierror(409,"user with email or username already exist")
    }
    let avatarLocalPath
    // const coverImageLocalPath=req.files?.coverImage[0]?.path
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0 ){
        avatarLocalPath=req.files.avatar[0].path
    } else{
        throw new Apierror(400,"Avtari file is required")
    }
    let coverImageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path    
    } 
    // console.log("avatar",req.files.avatar[0].size) 
    
    const avatar=await uploadOncloudinary(avatarLocalPath)
    const coverImage=await uploadOncloudinary(coverImageLocalPath)
    // console.log("files received",req.files); 
    // console.log("avatar",avatar)
     if(!avatar){
        throw new Apierror(400,"Avtar file is required")
    }

    const user=await User.create({
        username,
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new Apierror(500,"Something went wrong while register the user")
    }
    return res.status(201).json(
        new Apiresponse(200,user,"User register successfully")
    ) 
});

const loginuser=(async(req,res)=>{
    //req boby
    //check username or email and password
    //posswordcheck
    //access and referesh token  
    //send cookie 
    const {username,email,password}=req.body

    if(!(username || email)){
        throw new Apierror(400,"username or password is required ")
    }

    let user =await User.findOne({
        $or:[{username},{email}] 
    })
    if(!user) {
        throw new Apierror(404,"User does not exists")
    }
    const ispasswordvalid=await user.isPasswordCorrect(password)

    if(!ispasswordvalid){
        throw new Apierror(401,"Invalid user credentials")
    }
    const {accessToken,refreshToken}=await generateAccessandRefershTokens(user._id)

    const userlogged=await User.findById(user._id).select("-password -refreshToken")
    const option={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new Apiresponse(
            200,
            {
                user: userlogged, 
                accessToken, 
                refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined  
            }
        },
        {
            new:true
        }
    )

    const option={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(
        new Apiresponse(200,{},"User Logged out")
    )
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
        if(!incomingRefreshToken){
            throw new Apierror(401,"unauthorize request")   
        }
    
        const decodetoken=jwt.verify(
           incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodetoken?._id)
         if(!user){
            throw new Apierror(401,"invalid refresh token")   
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new Apierror(401,"refresh token is expire or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newrefreshToken}=await generateAccessandRefershTokens(user?._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new Apiresponse(
                200,
                {accessToken,refreshToken:newrefreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new Apierror(401,error?.message || "Invaldi refresh Token")
    }

})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
        const {oldPassword,newPassword}=req.body

        const user=User.findById(req.user?._id)  

})
export {
    registerUser,
    loginuser,
    logoutUser,
    refreshAccessToken
}   
import { User } from "../models/user.model.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudiinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
   



   const generateAccessAndRefreshToken=async (userId) => {
    try {
        const user= await User.findById(userId);
        const refreshToken=user.getRefreshToken()
        const accessToken=user.getAccessToken()
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:true})
        return {refreshToken,accessToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
   }
   const signUpUser=AsyncHandler(async(req,res)=>{
    const {fullName,email,username,password,bio}=req.body
    if([fullName,email,username,password,bio].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }
    const existeduser=await User.findOne(
        {
            $or:[{username},{email}]
        }
    )
    if(existeduser){
        throw new ApiError(409,"Username or email already exist");
    }
    const avatarLocalPath= req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
  throw new ApiError(400, "Avatar is required");
}

const avatar = await uploadOnCloudinary(avatarLocalPath);
if (!avatar?.url) {
  throw new ApiError(500, "Avatar upload failed");
}
    const user= await User.create(
        {
            fullName,
            email,
            username:username.toLowerCase(),
            avatar:avatar.url,
            bio,
            password
        }
    )
    const createdUser=await User.findById(user._id).select("-password  -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while creating the user ");
    }
    return res
    .status(200)
    .json( new ApiResponse(200,createdUser,"User created successfully"))

   })

   const loginUser=AsyncHandler(async (req,res) => {
    const {email,username,password} =req.body
    if(!username && !email){
        throw new ApiError(401,"Username or Email is required");
    }
    const user= await User.findOne({
        $or:[{email},{username}]
    })
    if(!user){
        throw new ApiError(404,"User not Found");
    }
    const isPasswordValid= user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Password");
    }
    const {accessToken,refreshToken}=user.generateAccessAndRefreshToken(user._id)
    const loginUser=await User.findById(user_.id).select("-password -refreshToken");
    if(!loginUser){
        throw new ApiError(500,"Login failed");
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{user:loginUser,refreshToken,accessToken},"Login successfully"))
   })

   const refreshAccessToken=AsyncHandler(async (req,res) => {
    const incommingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incommingRefreshToken){
        throw new ApiError(401,"Unauthorized access!!");
    }
    try {

        const decodedToken= jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user=await User.findById(decodedToken?._id)
        if(decodedToken !== user?.refreshToken){
            throw new ApiError(401,"Invalid token");
         }
         const { newRefreshToken,accessToken}= await generateAccessAndRefreshToken(user?._id)
         const options={
            httpOnly:true,
            secure:true
         }
         return res
         .status(200)
         cookie("refreshToken",refreshToken,options)
         .cookie("accessToken",accessToken,options)
         .json(new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"Access Token fetched successFully"))
    } catch (error) {
        throw new ApiError(401,"Invalid token");
    }
   })
   const logoutUser=AsyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user?._id,
        {
            $unset:{
                refreshToken:1
                    }
            },{new:true}
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{},"User Logout SucessFully "))
   })


//Update user details

   const updateUserDetails=AsyncHandler(async(req,res)=>{
    const {fullName,bio}=req.body
    if([fullName,bio].some((field)=>field.trim()==="")){
        throw new ApiError(401,"All fields are required ");
    }
    if (!mongoose.Types.ObjectId.isValid(req.user?._id)) {
       throw new ApiError(400, "Invalid user ID format");
}

    const updatedUser=await User.findByIdAndUpdate(user,
        {
           $set :{
            fullName:this.fullName,
            bio:this.bio
           }
        },{new :true}
    )
    if(!updatedUser){
        throw new ApiError(500,"Failed to update user details ");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"User Updated successfully"))
   })

   const updateavatar=AsyncHandler(async (req,res) => {
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(404,"Image not found");
        
    }
    const avatar=await uploadOnCloudiinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(401,"Failed to upload ")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },{new:true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar changed successfully "))
   })


   //Change password 
   const changePassword=AsyncHandler(async (req,res) => {
    const {oldPassword,newPassword}=req.body
    const user= await User.findById(req.user?._id)
    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401,"Incorrect Password");
    }
    user.password=newPassword;
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))
   })
//Change password 
const getuser=AsyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"Current user fetched Successfully"))
}) 

   export
   {
    signUpUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    loginUser,
    updateUserDetails,
    updateavatar,
    changePassword
   }
import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import {User} from "../models/user.model.js"


//=======================================================
//ACCESS OR CREATE CHAT
//=======================================================


const accessOrCreateChat=AsyncHandler(async (req,res) => {

    const {userId}=req.body

    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user Id");
    }

    //check existing chat
    const existingChat =await Chat.findOne({
        isGroupChat:false,
        users:{$all:[req.user._id,userId]}
    })
    .populate("users","-password")
    .populate("latestMessage")



    if(existingChat){
        return res
        .status(200)
        .json(new ApiResponse(200,existingChat,"Chat fetched successFully"))
    }
//create new Chat

        const newChat=await Chat.create({
            chatName:"private",
            isGroupChat:false,
            users:[req.user._id, userId]
        })

        const fullchat=await Chat.findById(newChat._id)
        .populate("users","-password")

         return res
         .status(200)
         .json(new ApiResponse(200,fullchat,"chat created successFully "))
})
//================================================================
//Fetch All Chats
//================================================================

const fetchAllChats=AsyncHandler(async (req,res) => {
    const chats=await Chat.find({ users : req.user._id})
    .populate("users","-password")
    .populate("groupAdmin","-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })

    return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chats fetched successfully"));
    
})

//=====================================================================
//++++++++++Create group CHat++++++++++++++++++++++++++++++++++++++++++
//=====================================================================



 const createGroupChat=AsyncHandler(async (req,res) => {
    const {chatName,users}=req.body
    if(!chatName || !users){
        throw new ApiError(401,"All fields are required");
    }
    const parsedUsers=JSON.parse(users)
    if(parsedUsers.length<2){
        throw new ApiError(400, "At least 3 members required");
    }

  parsedUsers.push(req.user._id);

  const groupChat = await Chat.create({
    chatName,
    users: parsedUsers,
    isGroupChat: true,
    groupAdmin: req.user._id
  });

  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  return res
    .status(201)
    .json(new ApiResponse(201, fullGroupChat, "Group created successfully"));
 })

 //=================================================================
 //Rename Group
 //=================================================================

 const updateGroupName=AsyncHandler(async (req,res) => {
    const {chatId,chatName}=req.body

    if(!chatId|| !chatName){
        throw new ApiError(400,"ChatId and chatName are required");
    }

    const chat= await Chat.findById(chatId);

    if(!chat){
        throw new ApiError(404,"Chat not found");
    }

    if(chat.groupAdmin.toString()!==req.user._id.toString()){
        throw new ApiError(401,"Unauthorized access");
        
    }

    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {chatName },
        {new:true})
        .populate("users","-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
    throw new ApiError(404, "Group chat not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "Group renamed successfully"));
 })
//============================================================
//Remove Group Member
//============================================================

const removeGroupMember=AsyncHandler(async (req,res) => {
    const {chatId,userId} =req.body

    if(!chatId || !userId){
        throw new ApiError(400,"ChatId and userId required");
    }
    const chat= await Chat.findById(chatId);

    if(!chat){
        throw new ApiError(404,"Chat not found");
    }

    if(!chat.isGroupChat){
        throw new Error(401,"Not a group chat ");
    }

    if(chat.groupAdmin.toString()!==req.user._id.toString()){
        throw new ApiError(401,"Unauthorized Access");
    }

    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{ users:userId }

        },{new:true})
        .populate("users","-password")
        .populate("groupAdmin","-password")


        return res
        .status(200)
        .json(new ApiResponse(200,updatedChat,"User removed successFully"))
})


//============================================================
//ADD Group Member
//============================================================

const addGroupMember=AsyncHandler(async (req,res) => {
     const {chatId,userId} =req.body
    if(!chatId || !userId){
        throw new ApiError(400,"ChatId and userId required");
    }
    const chat= await Chat.findById(chatId);

    if(!chat){
        throw new ApiError(404,"Chat not found");
    }
     const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
    if(!chat.isGroupChat){
        throw new Error(401,"Not a group chat ");
        
    }
    if(chat.groupAdmin.toString()!==req.user._id.toString()){
        throw new ApiError(401,"Unauthorized Access");
    }

    const updateChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            $addToSet:{ users:userId }

        },{new:true}).populate("users","-password")
        .populate("groupAdmin","-password")
        return res
        .status(200)
        .json(new ApiResponse(200,updateChat,"User Added successFully"))
})


export{
 accessOrCreateChat,
  fetchAllChats,
  createGroupChat,
  updateGroupName,
  removeGroupMember,
  addGroupMember
}
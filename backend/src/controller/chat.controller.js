import { Chat } from "../models/chat.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { AsyncHandler } from "../utils/AsyncHandler";
import mongoose, { isValidObjectId } from "mongoose";






const accessOrCreateChat=AsyncHandler(async (req,res) => {
    const {userId}=req.body
    if(!isValidObjectId(userId)){
        throw new ApiError(401,"Invalid user Id");
    }
    const existingChat =await Chat.findOne({
        isGroupChat:false,
        users:{$all:[req.user._id,userId]}
    }).populate("users","-password")
    .populate("latestMessage")
    if(existingChat){
        return res
        .status(200)
        .json(new ApiResponse(200,existingChat,"Chat fetched successFully"))
    }

        const newChat=await Chat.create({
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id, userId]
        })

        const fullchat=await Chat.findById(newChat._id)
        .populate("users","-password")
         return res
         .status(200)
         .json(new ApiResponse(200,fullchat,"chat created successFully "))
})


const fetchAllChats=AsyncHandler(async (req,res) => {
    const allUsers=await Chat.find(
       { users : req.user._id})
    .populate("users","-password")
    .populate("groupAdmin","-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })

      return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chats fetched successfully"));
    
})
 const createGroupChat=AsyncHandler(async (req,res) => {
    const {chatName,users}=req.body
    if(!chatName || !users){
        throw new ApiError(401,"All fields are required");
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

export{
    accessOrCreateChat,
    fetchAllChats,
    createGroupChat
}
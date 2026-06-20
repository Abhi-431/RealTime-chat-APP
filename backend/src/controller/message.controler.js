import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse";





const sendMessage=AsyncHandler(async (req,res) => {
    const {content,chatId}=req.body
    if(!content || !chatId){
        throw new ApiError(400,"chat id and content require");
    }
    if(!isValidObjectId(chatId)){
        throw new ApiError(400,"Invalid chat id");
    }
    const chat= await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found");
    }
     const isUserInChat = chat.users.some(
    (userId) => userId.toString() === req.user._id.toString()
  );

  if (!isUserInChat) {
    throw new ApiError(403, "You are not a member of this chat");
  }
    const message=await Message.create(
        {
            senderId:req.user._id,
            content,
            chat:chatId
        }
    )
    await Chat.findByIdAndUpdate(chatId,
        {
            latestMessage:message._id
        }
    )
    const fullMessage=await Message.findById(message._id)
    .populate("senderId","username")
    .populate("chat")
    return res
    .status(200)
    .json(new ApiResponse(200,fullMessage,"Message updated SuccessFully "))
})

const fetchAllMessage=AsyncHandler(async (req,res) => {
    const {chatId}=req.params
    if(!chatId){
        throw new ApiError(400,"Chat id is required");
    }
    if(!isValidObjectId(chatId)){
        throw new ApiError(401,"invalid chat id ");
        
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found");
        
    }
    const isUserInChat=chat.users.some(
        (userId)=>userId.toString()===req.user._id.toString()
    )
    if(!isUserInChat){
        throw new ApiError(403,"you are not a membe od this chat ");
        
    }
   const messages=await Message.find({chat:chatId})
   .populate("senderId","name email avatar")
   
   .sort({createdAt:-1})

   return res
   .status(200)
   .json(new ApiResponse(200,messages,"all message fetched successFully"))
    
})


 const markMessagesAsSeen = AsyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chatId");
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  // Authorization
  const isUserInChat = chat.users.some(
    (userId) => userId.toString() === req.user._id.toString()
  );

  if (!isUserInChat) {
    throw new ApiError(403, "You are not allowed");
  }

  // Mark unseen messages as seen
  await Message.updateMany(
    {
      chat: chatId,
      senderId: { $ne: req.user._id },
      seenBy: { $ne: req.user._id }
    },
    {
      $addToSet: { seenBy: req.user._id }
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Messages marked as seen"));
});


export{
    sendMessage,
    fetchAllMessage,
    markMessagesAsSeen
}
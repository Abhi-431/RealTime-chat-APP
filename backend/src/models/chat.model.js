import mongoose, { Schema } from "mongoose";




const chatSchema= new Schema({
    chatName:{
        type:String,
        required:true,
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message"
    },
    groupAdmin:{
       type:Schema.Types.ObjectId,
       ref:"User"
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],

})
 export const Chat= mongoose.model("Chat",chatSchema)
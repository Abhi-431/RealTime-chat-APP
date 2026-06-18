import mongoose,{Schema} from "mongoose";



const messageSchema= new Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    },
    isSeen:{
        type:Boolean,
        default :false
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },
    mediaUrl: {
      type: String
    },
}, {
    timestamps: true
  })
export const Message=mongoose.model("Message",messageSchema)
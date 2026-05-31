import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema= new Schema(
    {
        username:{
            type:String,
            require:true,
            unique:true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email:{
            type:String,
            require:true,
            unique:true,lowercase: true,
            trim: true, 
            
        },
        fullName:{
            type:String,
            require:true,
            trim: true, 
            index: true
        },
        password:{
            type:String,
            require:true,
            minlength:6
        },
        avatar:{
            type:String,
            default:""
        },
        bio:{
            type:String
        },
        refreshToken:{
            type:String
        }
    },{
        timestamps:true
    }
)

userSchema.pre("save",async function () {
    if (!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.getAccessToken=function () {
    return jwt.sign({
        _id:this._id,
        username:this.username,
        fullName:this.fullName,
        email:this.ema
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.getRefreshToken=function () {
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}






export const User=mongoose.model("User",userSchema)
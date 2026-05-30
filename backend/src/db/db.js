import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"



const connectDB=async () => {
   try {
    const connect= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
    console.log(`MongoDB Connexted: ${(await connect).connection.host}`)
   } catch (error) {
    console.log("MongoDB Connection Failed:",error.message);
    process.exit(1);
   }
}
export default connectDB;
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";




const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json("16kb"))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


app.use("/api/status",(req,res)=>res.send("Server is live"));


export default app;
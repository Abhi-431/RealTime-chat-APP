import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
 
import app from "./app.js";
import connectDB from "./db/db.js";


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log("Server running on port", process.env.PORT || 3000)
    })
}
)
.catch(err=>{
    console.log("Mongodb connection Failed",err)
})
   




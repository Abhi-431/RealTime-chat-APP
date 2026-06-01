import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";//by default come with nodejs all file system mange by this 



    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });

// upload data like image on clodinary to store all data 
/*
steps to upload some thing on cloudinary 
1.select file which you want to upload here i want to upload from my local system
2.upload it using c.uploder.up
3.unlink the fs after uploading 
*/
const uploadOnCloudiinary=async(localFilePath)=>{
    console.log(localFilePath)
    try {
        if(!localFilePath)return null;
        const response= await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:'auto'
            }
        )
        fs.unlinkSync(localFilePath)
        console.log("file is uploaded on cloudinary :",response.url)
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

// delete data like image on clodinary to store all data 
/*
steps to upload some thing on cloudinary 
1.select file which you want to delete (public_id)
2.delete it using c.uploder.destroy
3.unlink the fs after uploading 
*/
const deleteOnCloudinary=async(public_id,resource_type="image")=>{
    try {
        if(!public_id)return null;
        const response= await cloudinary.uploader.destroy(public_id,{
            resource_type:`${resource_type}`
        })
        
    } catch (error) {
        return error;
        console.log("delete on cloudinary failed", error);
    }
}

export {uploadOnCloudiinary,deleteOnCloudinary}
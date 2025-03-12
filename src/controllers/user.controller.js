import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const registerUser=asyncHandler(async(req,res)=>{
    const {username,name,email,password,role,branch,year}=req.body;
    if(!username|| !name || !email || !password || !role || !branch || !year) throw new ApiError(402,"fill all the mandatory fields")
    
        const existedUser = await User.findOne({
            $or:[{username},{email}]
        })

    if (existedUser){
        throw new ApiError(401,"user with this credentials already exists")
    }

    const user =await User.create(
        {username,name,email,password,role,branch,year}
    )

    const createdUser=await User.findById(user._id);
    if(!createdUser) throw new ApiError(404,"error user not made")

        return res.status(200).json(new ApiResponse(200,createdUser,"user has been made"))
})

export const getAllUser=asyncHandler(async(req,res)=>{
    const allUsers=await User.find().populate("questions");
    if(!allUsers) throw new ApiError(404,"not able to get data")

    return res.status(200).json(new ApiResponse(200,allUsers,"data of all"))
})

export const oneUser=asyncHandler(async(req,res)=>{
    const userId=req.params.userId;
    if(!userId) throw new ApiError(404,"user id not receibed")
    
    const user=await User.findById(userId);
    if(!user) throw new ApiError(402,"couldnt find the user ")
    
    return res.status(200).json(new ApiResponse(200,user,"user found"))
})
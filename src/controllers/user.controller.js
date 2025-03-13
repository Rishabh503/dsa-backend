import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const registerUser=asyncHandler(async(req,res)=>{
    const {username,name,email,password,role,branch,year}=req.body;
    // console.log("req ",req.body)
    if(!username|| !name || !email || !password  || !branch || !year) throw new ApiError(402,"fill all the mandatory fields")
    
        const existedUser = await User.findOne({
            $or:[{username},{email}]
        })

    if (existedUser){
        throw new ApiError(401,"user with this credentials already exists")
    }

    const user =await User.create(
        {username,name,email,password,role:"user",branch,year}
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
    
    const user=await User.findById(userId).populate("questions");
    if(!user) throw new ApiError(402,"couldnt find the user ")
    
    return res.status(200).json(new ApiResponse(200,user,"user found"))
})

const generateTokens=async (userId)=>{
    
    const user= await User.findById(userId);
    if (!user){
        throw new ApiError(201,"user not found in generating tokens")
    }

    const accessToken=user.generateAcessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}


}

export const login = asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    console.log(req.body)

    if(!email || !password) throw new ApiError(401,"fill all fields")

    const user=await User.findOne({email});
    if(!user) throw new ApiError(400,"user with these credentials doesnt exists")
    
    const passwordValid=await user.isPasswordCorrect(password);

    if(!passwordValid) throw new ApiError(404,"password is wrong")

    const {accessToken,refreshToken}=await generateTokens(user._id);

    console.log(accessToken,refreshToken)

    const options={
        httpOnly:true
        ,secure:true
    }
    

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    console.log(loggedInUser)

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
        user:loggedInUser,
        accessToken:accessToken,
        refreshToken:refreshToken
    }))
    
})

export const loggoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User gaya ie logout"))
})

export const userInfo=asyncHandler(async(req,res)=>{
    const user =await User.findById(req.user._id).select('-password -refreshToken')
    return res.status(200).json(new ApiResponse(200,user,"user details are these"))
})
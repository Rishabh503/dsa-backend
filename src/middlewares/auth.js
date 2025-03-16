import jwt from "jsonwebtoken"
// import { User } from "../models/user..js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT=asyncHandler(async (req,res,next)=>{
    try {
        //cookie lao
        const newToken= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!newToken) throw new ApiError(401,"token ni mila")

        const verifiedToken=jwt.verify(newToken,process.env.ACCESS_SECRET_KEY);
        if(!verifiedToken) throw new ApiError(404,"error is verify of tokens failed in auth middlware")
        
        const user=await User.findById(verifiedToken?._id).select("-password -refreshToken")
        if(!user) throw new ApiError(404,"invalid acess token")
        req.user=user;
        next();
    } 
    catch (error) {
        console.log(error)
        throw new ApiError(401,"error in verifying jwt")
    }
})
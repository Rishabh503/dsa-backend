import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Extract token from cookies or headers
    const newToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!newToken) {
        throw new ApiError(401, "Access token not found.");
    }

    try {
        // Verify token
        const verifiedToken = jwt.verify(newToken, process.env.ACCESS_SECRET_KEY);

        // Fetch user details
        const user = await User.findById(verifiedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "Invalid access token. User not found.");
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        throw new ApiError(401, "Invalid or expired token.");
    }
});

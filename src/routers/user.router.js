import { Router } from "express";
import { registerUser,getAllUser, oneUser, login, loggoutUser,userInfo } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

export const UserRouter=Router();
UserRouter.route("/register").post(registerUser)
UserRouter.route("/allUsers").get(getAllUser)
UserRouter.route("/oneUser/:userId").get(oneUser)
// login logout 
UserRouter.route("/login").post(login)
UserRouter.route("/logout").post(verifyJWT,loggoutUser)
UserRouter.route("/profile").post(verifyJWT,userInfo)

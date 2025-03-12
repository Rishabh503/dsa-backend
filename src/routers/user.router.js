import { Router } from "express";
import { registerUser,getAllUser, oneUser } from "../controllers/user.controller.js";

export const UserRouter=Router();
UserRouter.route("/register").post(registerUser)
UserRouter.route("/allUsers").get(getAllUser)
UserRouter.route("/oneUser/:userId").get(oneUser)
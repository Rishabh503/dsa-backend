import mongoose from "mongoose";
import { Question } from "../models/question.model.js";
import { Reminder } from "../models/reminder.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const createNewQuestion=asyncHandler(async(req , res)=>{
    const {name,link,level,deadlineByAdmin}=req.body;
    if(!name || !link || !level || !deadlineByAdmin) throw new ApiError(403,"fill all fields")
    const question=await Question.create({
        name,
        link,
        level,
        deadlineByAdmin
    })
    const createdQuestion=await Question.findById(question._id)
    if(!createdQuestion) throw new ApiError(401,"error making ques")
    
    await User.updateMany({},
        {
            $addToSet:{
                questions:{
                    questionId:question._id,
                    status:"pending"
                }
            }
        }
    )

    return res.status(200).json(new ApiResponse(200,createdQuestion,"question made"))
})

export const getAllQuestions=asyncHandler(async(req,res)=>{
    const allQues=await Question.find();
    if(!allQues) throw new ApiError(401,"couldnt get ques")
    return res.status(200).json(new ApiResponse(200,allQues,"all ques list"))
})

export const changeStatus = asyncHandler(async (req,res) => {
    const questionId=req.params.questionId;
    if(!questionId) throw new ApiError(404,"ques id not found")
    const userId=req.params.userId;
    if(!userId) throw new ApiError(404,"user id not found")
    const {status}=req.body
    if(!status) throw new ApiError(404,"new status id not found")
    const user=await User.findById(userId);
// console.log(user)
    user.questions=user.questions.map((question)=>(question.questionId==questionId?
        {...question,status:status}:question))
    console.log(user.questions)
        await user.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponse(200,{},"updated succesfully"))
})


export const changeCurrentPassword=asyncHandler(async (req,res)=>{
    const {oldPassword,newPassword}=req.body;
    // console.log(req.body)
    if(!oldPassword || !newPassword) throw new ApiError(401,"fill all fields");
    // console.log(req.user)
    console.log("Token from request:", req.cookies?.accessToken || req.header("Authorization"));
    console.log(req.user)
    const userid=await req.user?._id;
    console.log(userid)
    const user= await User.findById(userid)

    if(!user) throw new ApiError(401,"user finding error")

    const validOldPassword=await user.isPasswordCorrect(oldPassword);
    if(!validOldPassword) throw new ApiError(401,"old password is wronfg")

    user.password=newPassword;

    await user.save({validateBeforeSave:false});

    return res.status(201)
    .json(new ApiResponse(200,{},"password changed succesfully"))


})

export const newReminder=asyncHandler(async(req,res)=>{
    // question user date status 

    const questionId=req.params.questionId
    // console.log("passed qid")
    if(!questionId) throw new ApiError(402,"error extracting the questionId")
    const question=await Question.findById(questionId);
    if(!question) throw new ApiError(402,"invalid question details or question doesnt exist")
        console.log(question)


    const userId=req.params.userId
    if(!userId) throw new ApiError(402,"error extracting the userId")
    const user=await User.findById(userId);
    if(!user) throw new ApiError(402,"invalid user details or user doesnt exist")
    const {date}=req.body
console.log(date)
    if(!date) throw new ApiError(404,"fill the date")

    const reminder=await Reminder.create({
        question:question,
        user:user,
        date:date,
        status:"pending"
    })

    const createdReminder=await Reminder.findById(reminder);
    if(!createdReminder) throw new ApiError(404,"errror creating the reminder ")
    user.reminders=user.reminders.push(createdReminder)
    await user.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponse(200,createdReminder,"reminder has been created"))
})


export const markAsStarred = asyncHandler(async (req, res) => {
    const { questionId, userId } = req.params;
    if (!questionId) throw new ApiError(402, "Error extracting the questionId");
    if (!userId) throw new ApiError(402, "Error extracting the userId");

    const question = await Question.findById(questionId);
    if (!question) throw new ApiError(402, "Invalid question details or question doesn't exist");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(402, "Invalid user details or user doesn't exist");

    const { starred } = req.body;
    if (starred === undefined) throw new ApiError(404, "Fill the details");

    const questionExists = user.starred.some(ques => ques.toString() === questionId);

    if (starred) {
        if (!questionExists) {
            user.starred.push(question._id);
        }
    } else {
        user.starred = user.starred.filter(ques => ques.toString() !== questionId);
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, user, "Marked successfully"));
});


export const changeReminderStatus=asyncHandler(async(req,res)=>{
    
    const reminderId=req.params.reminderId;
    if(!reminderId) throw new ApiError(402,"error reminderId not valid or not found")
    const reminder=await Reminder.findById(reminderId);
    if(!reminder) throw new ApiError(402,"error reminder not valid or not found")
    const status=req.body;
console.log(status.status)
    if(!status) throw new ApiError(402,"couldnt recieve the status from the frontend")
    reminder.status=status.status;
    await reminder.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,reminder,"remindere has been updated"))
})
import { Question } from "../models/question.model.js";
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

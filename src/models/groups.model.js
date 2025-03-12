import mongoose from "mongoose";

const groupSchema=new mongoose.Schema({
    question:{
         type:Schema.Types.ObjectId,
            ref:"Question"
    },
    user:{
         type:Schema.Types.ObjectId,
         ref:"User"
    },
    title:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Group=mongoose.model("Group",groupSchema)
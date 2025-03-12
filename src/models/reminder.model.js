import mongoose from "mongoose";

const remniderSchema=new mongoose.Schema({
    question:{
         type:Schema.Types.ObjectId,
            ref:"Question"
    },
    user:{
         type:Schema.Types.ObjectId,
         ref:"User"
    },
    date:{
        type:Date,
        required:true
    },
    status:{
        type:String
    }

},{timestamps:true})

export const Reminder=mongoose.model("Reminder",remniderSchema)
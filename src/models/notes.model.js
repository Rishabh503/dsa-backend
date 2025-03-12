import mongoose from "mongoose";

const noteSchema=new mongoose.Schema({
    question:{
         type:Schema.Types.ObjectId,
            ref:"Question"
    },
    user:{
         type:Schema.Types.ObjectId,
         ref:"User"
    },
  
    text:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Note=mongoose.model("Note",noteSchema)
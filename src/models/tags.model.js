import mongoose from "mongoose";

const tagSchema=new mongoose.Schema({
    question:{
         type:Schema.Types.ObjectId,
            ref:"Question"
    },
    title:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Tag=mongoose.model("Tag",tagSchema)
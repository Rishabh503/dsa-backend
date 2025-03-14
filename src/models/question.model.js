import mongoose, { Mongoose, Schema } from "mongoose";

export const questionSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    level:{
        type:String,
        required:true
    },
    tags:[
        {
            type:Schema.Types.ObjectId,
            ref:"Tag"
        }
    ],
    deadlineByAdmin:{
        type:Date,
        required:true
    },
    groups:[
        {
            type:Schema.Types.ObjectId,
            ref:"Group"
        }
    ],
    reminders:[
        {
             type:Schema.Types.ObjectId,
            ref:"Reminder"
        }       
    ],
    starred:Boolean,
    solvedBy:String,
    notes:[
        {
             type:Schema.Types.ObjectId,
            ref:"Note"
        }
    ]
},{timestaps:true})

export const Question=mongoose.model("Question",questionSchema)
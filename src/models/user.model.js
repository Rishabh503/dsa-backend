import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    branch:{
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'], // Can be either 'admin' or 'user'
      default: 'user'
    },
    questions: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
          },
          status: {
            type: String,
            enum: ["pending", "solved"],
            default: "pending"
          }
        }
    ]     , 
    reminders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Reminder"
        }
    ],
    starred:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Question"
        }
    ],
    notes:[
        
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Note"
           
        }
    ],
    groups:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Group"
        }
    ]

  },{timestamps:true});
  

  userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect= async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAcessToken=function (){
    return jwt.sign({
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
    process.env.ACCESS_SECRET_KEY,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)}

userSchema.methods.generateRefreshToken=function (){
    return jwt.sign(
        {
        _id:this._id
        },
            process.env.REFRESH_SECRET_KEY
         ,
         {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
         }
    )
}



 export const User = mongoose.model('User', userSchema);
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDataBase=async()=>{
    try {
        // console.log(process.env.MONOGODB_URI)
        const connectionDB=await mongoose.connect(`${process.env.MONOGODB_URI}/${DB_NAME}`)
         console.log("db connection done")
        // co/
    } catch (error) {
        console.log("error while connecting the database in db/index.js: ",error)
    }
}

export default connectDataBase;
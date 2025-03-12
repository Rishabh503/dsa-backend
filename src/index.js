import dotenv from "dotenv";
import connectDataBase from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path:'./env'
})

connectDataBase()
.then(()=>{
    app.listen(process.env.port || 5000,()=>{
        console.log(`server is runniig at port : ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("error in app and db connection at index.js of src",error)
})
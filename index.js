import express from "express"
import connectDataBase from "./src/db/index.js";

import dotenv from "dotenv";
export const app=express();

// app.use()

dotenv.config(
        {path:"./env"}
    )


connectDataBase()
.then(()=>{
    app.listen(3000,()=>{
        console.log("server is running at the port",3000)
    })
})
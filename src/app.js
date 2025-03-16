import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";




export const app=express();

// isme 2 -3 steps krne h

// config cors cookieparser and 2-3 express middlewares 

// cors
app.use(cors({
    origin:"https://dsa-frontend-one.vercel.app/",
    credentials:true
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",'https://dsa-frontend-one.vercel.app/');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//express ke 
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))

//cookie parser
app.use(cookieParser())
import { UserRouter } from "./routers/user.router.js";
import { ApiError } from "./utils/ApiError.js";
import { questionRouter } from "./routers/question.router.js";
app.use("/api/v1/user",UserRouter)

app.use('/api/v1/question/',questionRouter)

app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    console.log("Error Type:", err.constructor.name);
    console.log("Instance of ApiError:", err instanceof ApiError);
    console.log("Full Error Object:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

    res.setHeader("Content-Type", "application/json");

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
            statusCode: err.statusCode,
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
    });
});

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";



export const app=express();

// isme 2 -3 steps krne h

// config cors cookieparser and 2-3 express middlewares 

// cors
app.use(cors({
    origin:process.env.CORS,
    credentials:true
}))


//express ke 
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))

//cookie parser
app.use(cookieParser())

// import { userRouter } from "./routers/user.routes.js";
// app.use("/api/v1/users",userRouter)

// import { categoryRouter } from "./routers/category.route.js";
// app.use("/api/v1/categories",categoryRouter);

// import { productRouter } from "./routers/product.routes.js";
// app.use("/api/v1/products",productRouter)

// import {billRouter} from "./routers/bill.route.js"
// app.use("/api/v1/bills",billRouter)

// import {visitRouter} from "./routers/visit.route.js"
// app.use("/api/v1/visits",visitRouter)

// import {enquiryRouter} from "./routers/enquiry.route.js"

// app.use('/api/v1/enquiry',enquiryRouter)
// import { complaintRouter } from "./routers/complaint.route.js";
// app.use('/api/v1/complaint',complaintRouter)
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

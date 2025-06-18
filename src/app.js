import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: '16kb' 
}));
app.use(express.urlencoded({
    extended: true,
    limit: '16kb' 
}));  
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser());

import userRouter from './routes/user.routes.js';
// app.use(express.json())  
app.use("/api/v1/user",userRouter)   
export {app}  // This file sets up an Express application instance.
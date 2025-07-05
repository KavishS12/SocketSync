import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import {app,server} from './lib/socket.js';

dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' })); // increase body size limit for image uploads
app.use(express.urlencoded({ limit: '10mb', extended: true })); // increase body size limit for form data
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));

//test route
app.get('/',(req,res) => {
    res.send('Hello world!')
});

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
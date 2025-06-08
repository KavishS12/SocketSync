import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

//test route
app.get('/',(req,res) => {
    res.send('Hello world!')
});

app.use("/api/auth",authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
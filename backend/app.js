import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/connectdb.js';
import UserModel from './models/user.js';
import userRoutes from './routes/userRoutes.js';
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//CORS
app.use( cors() );

//DATABASE
connectDB( DATABASE_URL );
//JSON
app.use( express.json() );

//Load Routes
app.use( "/api/user", userRoutes );


 
app.listen( PORT,()=> { console.log( `app is listening to PORT:${PORT}` ) } );
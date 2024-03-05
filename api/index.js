import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersAllRoute from './routes/usersAll.js';
import fileUploadRoute from './routes/files.js';
import cookieParser from 'cookie-parser';
import cors from  'cors';



//declaring my app
const app = express();

// Setting headers for WebAssembly threads
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

//using CORS TO allow access
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

//config dotenv middleware
dotenv.config();

//Middleware for starting app
app.use(express.json());

//Installed cookieParser to handle cookies
app.use(cookieParser());

//Middleswares for  all routes


//auth routes
app.use('/api/auth', authRoute);

//Admin routes for finding all users
app.use('/api/users', usersAllRoute);
app.use('/', fileUploadRoute);





//Middlewares for Response handlers and getting a nice error response
app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const message = obj.message || 'Something went wrong';
  return res.status(statusCode).json({
    success: [200, 201, 204].some((a) => a === obj.status),
    status: statusCode,
    message: message,
    data: obj.data,
  });
});








//Connecting to my DB
const connectMongoDB = async () => {
  console.log('Connecting to my Database')
  try {

    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to Database mongodb://localhost:27017');
  } catch (error) {
    throw error;
  }
};

//Starting backend server
app.listen(8000, () => {
  connectMongoDB();
  console.log('Connected to Backend server on port 8000');
});

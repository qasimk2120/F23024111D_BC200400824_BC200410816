import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import adminCrud from './routes/adminCrud.js';
import fileUploadRoute from './routes/files.js';
import cookieParser from 'cookie-parser';
import cors from  'cors';


//----------------------------------------------------------------------------
//declaring my app
const app = express();
//----------------------------------------------------------------------------
// Setting headers for WebAssembly threads
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
  next();
});
//----------------------------------------------------------------------------
//using CORS TO allow access
const allowedOrigins = ['http://localhost:4200', 'http://localhost:8000'];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
//----------------------------------------------------------------------------
//config dotenv middleware
dotenv.config();
//----------------------------------------------------------------------------
//Middleware for starting app
app.use(express.json());
//----------------------------------------------------------------------------
//Installed cookieParser to handle cookies
app.use(cookieParser());
//----------------------------------------------------------------------------
//Middleware for  all routes

//----------------------------------------------------------------------------
//auth routes
app.use('/api/auth', authRoute);
//----------------------------------------------------------------------------
//Admin routes for finding all users
app.use('/api/users', adminCrud);
app.use('/', fileUploadRoute);
//----------------------------------------------------------------------------

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
//----------------------------------------------------------------------------
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
//----------------------------------------------------------------------------
//Starting backend server
app.listen(8000, () => {
  connectMongoDB();
  console.log('Connected to Backend server on port 8000');
});

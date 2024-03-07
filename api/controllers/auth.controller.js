import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  nodemailer from "nodemailer";
import { OAuth2Client } from 'google-auth-library';
import UserToken from "../models/UserToken.js";
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//-------------------------------------------------------------------------------------------------------------\\
// Function to check if user already exists either by username or email
const checkExistingUser = async (userName, email) => {
  return User.findOne({
    $or: [{userName: userName}, {email: email}]
  });
};

//-------------------------------------------------------------------------------------------------------------\\
//Admin Registration process
export const registerAdmin = async (req, res, next) => {
  const existingAdminUser = await checkExistingUser(req.body.userName, req.body.email);
  if(existingAdminUser){
    if(existingAdminUser.userName === req.body.userName){
      return next(CreateError(403, 'Username is already in use'))
    }
    if(existingAdminUser.email === req.body.email){
      return next(CreateError(403, 'Email is already in use'))
    }
  }
  //using bcrypt here in Auth for hashing the password
  //find all roles
  const role = await Role.find({});
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: hashPassword,
    isAdmin: true,
    roles: role,
  });
  await newUser.save();
  return next(CreateSuccess(200, 'Admin Registered Successfully'));
};



//-------------------------------------------------------------------------------------------------------------\\
//Admin Login functionality
export const loginAdmin = async (req, res, next) => {
  try {
    // Authenticate admin user
    const user = await User.findOne({ email: req.body.email, isAdmin: true });
    if (!user) {
      return next(CreateError(401, 'Admin not found'));
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return next(CreateError(401, 'Password incorrect'));
    }

    // Generate token
    const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET);

    // Set token in response cookie
    res.cookie('access_token', token, { httpOnly: true }).status(200).json({
      status: 200,
      message: 'Login Success',
      data: user // Include any additional data you want to send in the response
    });
  } catch (err) {
    return next(CreateError(500, 'Something went wrong'));
  }
};



//-------------------------------------------------------------------------------------------------------------\\
//User Registration Function along with request handlers
export const register = async (req, res, next) => {
  const existingUser = await checkExistingUser(req.body.userName, req.body.email);
// checking if user already exists either by username or email inside registration request
  if(existingUser){
    if(existingUser.userName === req.body.userName){
      return next(CreateError(403, 'Username is already in use'))
    }
    if(existingUser.email === req.body.email){
      return next(CreateError(403, 'Email is already in use'))
    }
  }
  //using bcrypt here in Auth for hashing the password
  const role = await Role.find({ role: 'User' });
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: hashPassword,
    roles: role,
  });
  await newUser.save();
  return next(CreateSuccess(200, 'User Registered Successfully'));
};


//-------------------------------------------------------------------------------------------------------------\\
//LOGIN function along with request handlers
export const login = async (req, res, next) => {

  try {
    //Getting the user role reference here on .populate from the User.js database  along with first finding the user email on User.js database
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );
    if (!user) {
      return next(CreateError(401, 'User not found'));
    }
    //destructing
    const { roles } = user;
    //comparing the Entered Password and the database password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(CreateError(401, 'Password incorrect'));
    }
    //Creaing JWT token
    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, roles: roles},
      process.env.JWT_SECRET)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    //Sending cookie on successful login to the client side
    res.cookie("access_token", token, { expires: expirationDate, httpOnly: true }).status(200).json({
      status: 200,
      message: 'Login Success',
      data: user
    });
  } catch (err) {
    return next(CreateError(500, 'Something went wrong'));
  }
};


//Login and SignUp with Google Account
export const googleSignIn = async (req, res, next) => {
  const { token }  = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, picture, sub: googleId } = ticket.getPayload();

  let user = await checkExistingUser(email);

  if (!user) {
    user = new User({
      firstName: name,
      lastName: name,
      userName: email,
      email: email,
      googleId: googleId,
      // ... other fields
    });
    await user.save();
  } else if (!user.googleId) {
    user.googleId = googleId;
    await user.save();
  }

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(200).json({
    status: 200,
    message: 'Login Success',
    data: jwtToken
  });
};




//-------------------------------------------------------------------------------------------------------------\\
//Forgot Password Implementation

export const sendEmail = async (req, res, next) => {

  const email = req.body.email;

  const user = await User.findOne({email: {$regex: '^'+email+'$', $options: 'i'}});

  if (!user) {
    return next(CreateError(404, 'User Not Found, Please Ensure that You enter a valid Email'));
  }

  const payload = { email: user.email };
  const expiryTime = 300;
  const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: expiryTime});


  const newToken = new UserToken({
    userId: user._id,
    token: token
  });

  const mainTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "qk71086@gmail.com",
      pass: "uindivgjmphexouv",
    }
  });
  const resetLink = `${process.env.LIVE_URL}/reset/${token}`;


  let mailDetails = {
    from: "qk71086@gmail.com",
    to: email,
    subject: "Reset Password!",
    html: `<html>
    <head>
        <title>Password Reset Request </title>
    </head>
    <body>
        <h1>Password Reset Request</h1>
        <p>Dear ${user.userName},</p>
        <p> We have received a request to reset your password for your account with EditMasters. To Complete the password reset process, please click on the button below : </p>
        <a href="${process.env.LIVE_URL}/reset/${token}"><button style="background-color: #4CAF50 ; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button></a>
        <p>Please note that this link is only valid for a 5 mins. If you did not request a password reset, please disregard this message.</p>
        <p>Thank you,Edit Masters Team</p>
    </body> 
    </html>`
  };

  console.log('Sending email');

  mainTransporter.sendMail(mailDetails, async(err, data) => {
    if (err) {
      return next(CreateError(500, 'Something went wrong while sending mail'));
    } else {
      console.log('Email sent successfully');
      await newToken.save();
      console.log('Token saved to database');
      return next(CreateSuccess(200, 'Email was Sent Successfully, Please Check your Inbox'));
    }
  });
};



//-------------------------------------------------------------------------------------------------------------\\

//UPDATING the password in the backend and database
export const resetPassword = (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.newPassword;

  jwt.verify(token, process.env.JWT_SECRET, async (err,data)=>{
  if (err) {
    return next(CreateError(500, 'Reset Link Expired'));
  }else {
    const response = data;
    const user = await User.findOne({email: {$regex: '^' + response.email + '$', $options: 'i'}});
    const salt = await bcrypt.genSalt(10);
    if (!newPassword) {
      return next(CreateError(400, 'New password is required'));
    }
    const encryptedPassword = await bcrypt.hash(newPassword, salt)
    user.password = encryptedPassword;
    try {
      const updatedUser = await User.findOneAndUpdate(
          {_id: user._id}, {$set: user}, {new: true}
      )
      return next(CreateSuccess(200, "Successfully updated the password"))
    } catch (err) {
      return next(CreateError(200, 'Error updating the password'))
    }
  }
  })
}



//-------------------------------------------------------------------------------------------------------------\\

export const logout = (req, res) => {
  // Clear the HttpOnly cookie
  console.log('Cookies:', req.cookies);
  res.clearCookie('access_token');
  // Send a success response
  res.status(200).json(CreateSuccess(200, 'Logged out', null));
};

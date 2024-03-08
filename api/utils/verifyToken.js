import jwt from 'jsonwebtoken';
import { CreateError } from './error.js';

//----------------------------------------------------------------------------
//verifying the token here
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token)
    return next(CreateError(401, 'You are not not allowed to access this'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(CreateError(403, 'Token is not valid'));
    } else {
      req.user = user;
    }
    next();
  });
};

//----------------------------------------------------------------------------
//Verifying if the user is a user
export const verifyUser = (req, res, next) => {
  //checking if this is the user id is correct and  if this is the user or admin
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(CreateError(403, 'You are not authorized'));
    }
  });
};



//----------------------------------------------------------------------------
//Verifying if the user is an admin
export const verifyAdmin = (req, res, next) => {
  //checking if this is the user id is correct and  if this is the user or admin
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(CreateError(403, 'You are not authorized'));
    }
  });
};
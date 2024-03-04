import User from '../models/User.js';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false }).populate('roles'); // Exclude admin
    return next(CreateSuccess(200, 'All users found Successfully', users));
  } catch (error) {
    return next(CreateError(500, 'Internal Server Error' + error.message));
  }
};
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('roles');
    if (!user) {
      return next(CreateError(404, 'User not found'));
    } else {
      return next(CreateSuccess(200, 'User Found, User details :' ,user));
    }
  } catch (error) {
    return next(CreateError(500, 'Internal Server Error' + error.message));
  }
};
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return next(CreateError(404, 'User not found'));
    } else {
      return next(CreateSuccess(200, 'User updated successfully', user));
    }
  } catch (error) {
    return next(CreateError(500, 'Internal Server Error' + error.message));
  }
};
export const activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!user) {
      return next(CreateError(404, 'User not found'));
    } else {
      return next(CreateSuccess(200, 'User activated successfully', user));
    }
  } catch (error) {
    return next(CreateError(500, 'Internal Server Error' + error.message));
  }
};
export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) {
      return next(CreateError(404, 'User not found'));
    } else {
      return next(CreateSuccess(200, 'User deactivated successfully', user));
    }
  } catch (error) {
    return next(CreateError(500, 'Internal Server Error' + error.message));
  }
};
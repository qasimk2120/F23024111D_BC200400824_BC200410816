import Role from '../models/Role.js';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';

export const createRole = async (req, res, next) => {
  try {
    if (req.body.role && req.body.role !== '') {
      const newRole = new Role(req.body);
      await newRole.save();
      return next(CreateSuccess(200, 'Role Created Successfull'));
    } else {
      return next(CreateError(404, 'Bad request'));
    }
  } catch (error) {
    return next(CreateError(500, 'Server error:' + error.message));
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById({ _id: req.params.id });
    if (role) {
      const newData = await Role.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return next(CreateSuccess(200, 'Role Updated'));
    } else {
      return next(CreateError(404, 'Role not found'));
    }
  } catch (error) {
    return next(CreateError(500, 'Server error: ' + error.message));
  }
};

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({});
    return next(CreateSuccess(200, roles));
  } catch (error) {
    return next(CreateError(500, 'Internal Server Error' + error.message));
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findById({ _id: roleId });
    if (role) {
      await Role.findByIdAndDelete(roleId);
      return next(CreateSuccess(200, 'Role deleted successfully'));
    } else {
      return next(CreateError(404, 'Role not found'));
    }
  } catch (error) {
    return next(CreateError(500, 'Internal Server Error' + error.message));
  }
};

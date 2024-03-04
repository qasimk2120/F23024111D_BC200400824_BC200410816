import express from 'express';
import {
  getAllUsers,
  getUserById,
} from '../controllers/usersall.controller.js';
import {updateUser,activateUser, deactivateUser} from "../controllers/usersall.controller.js";
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

///Get all users and the admin can see all the user data
router.get('/getall', verifyAdmin, getAllUsers);

///Get a user by their id and by using Verify user providing profile authorization, only the user logged in can own profile
router.get('/:id', verifyUser, getUserById);

//view Deactivate, UpdateUser, activate user
router.put('/:id', verifyAdmin, updateUser);
router.put('/:id/activate', verifyAdmin, activateUser);
router.put('/:id/deactivate', verifyAdmin, deactivateUser);

export default router;

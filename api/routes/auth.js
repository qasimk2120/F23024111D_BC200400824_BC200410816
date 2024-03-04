import express from 'express';
import {
  register,
  login,
  registerAdmin,
    loginAdmin,
  sendEmail,
  resetPassword,
    logout
} from '../controllers/auth.controller.js';
import {uploadPDFFile} from "../controllers/file.controller.js";

const router = express.Router();

//register endpoint
router.post('/register', register);
//login endpoint
router.post('/login', login);
router.post('/logout', logout);
//register as Admin

router.post('/admin-register', registerAdmin);
router.post('/admin-login', loginAdmin);

//Sending Email for password recovery
router.post('/send-email', sendEmail);

//Resetting password inside the database
router.post('/reset-password', resetPassword);

router.post('/file-upload', uploadPDFFile);
export default router;

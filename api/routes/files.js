import express from 'express';
import {uploadPDFFile, sendPDFFile} from "../controllers/file.controller.js";

const router = express.Router();
router.post('/uploadPDF', uploadPDFFile); //Route to store uploaded files in the server
router.get('/pdf/:filename', sendPDFFile);
export default router;

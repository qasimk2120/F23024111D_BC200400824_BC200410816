import multer from 'multer';
import path from 'path';
import {CreateError} from "../utils/error.js";
import {CreateSuccess} from "../utils/success.js";
import { fileURLToPath } from 'url';


//----------------------------------------------------------------------------
// Setting up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Replace spaces and special characters with underscores in the original file name
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, safeFilename);
  }
});

const upload = multer({ storage: storage });

//----------------------------------------------------------------------------
export const uploadPDFFile = (req, res) => {
  upload.single('file')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json(CreateError(500, err.message));
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json(CreateError(500, err.message));
    }

    // If Everything went fine.

    // Including the new filename in the response
    const newFilename = req.file.filename;
    return res.status(200).json(CreateSuccess(200, 'File uploaded successfully', { filename: newFilename }));
  });
};

//----------------------------------------------------------------------------
//Sending file to front end, to the PDFTRON
export const sendPDFFile = (req, res) => {
  let filename = req.params.filename;
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const fileDirectory = path.resolve(dirname, '../uploads');
  const filePath = path.join(fileDirectory, filename);
  res.sendFile(filePath);
};

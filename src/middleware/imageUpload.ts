import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
// import Datauri from 'datauri';

// import dotenv from 'dotenv';
// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: "duwwlul7d",
//   api_key: "256144325269663",
//   api_secret: "pioMGYEXVHjQF2rXWjwKTDL2SSQ",
// });

// // Multer setup
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// export const uploadMiddleware = upload.single('file');

// export const uploadToCloudinary = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (!(req as any).file) {
//       throw new Error('No file provided');
//     }

//     console.log((req as any).file.originalname);

//     const result = await cloudinary.uploader.upload((req as any).file.buffer, {
//       folder: 'your_folder_name', // Optionally, you can specify a folder in Cloudinary
//     });

//     console.log(result);

//     (req as any).imageURL = result.secure_url;
//     console.log((req as any).imageURL);

//     next();
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error);

//     return res.status(400).json({ error: 'Failed to upload to Cloudinary' });
//   }
// };


import path from "path";

// Set storage engine
const storage = multer.diskStorage({

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});

export const uploadMiddleware = upload.single('file');

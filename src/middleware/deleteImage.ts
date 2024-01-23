
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import * as CustomErrors from "../errors";

interface MulterRequest extends Request {
  file: any;
  imageURL?: string; 
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY ,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();

export const deleteFromCloudinary = async (_req: MulterRequest, _res: Response, _next: NextFunction) => {
    try {
      if (_req.imageURL) {
        const publicId = _req.imageURL.split('/').pop()?.split('.')[0];
  
        await cloudinary.uploader.destroy(publicId as string);
      }
  
      _next();
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    _next(new CustomErrors.InternalServerError("Internal server error"));

    }
  };
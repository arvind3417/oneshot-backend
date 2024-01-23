import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as CustomError from "../errors";
import { httpResponse } from "../helpers";
import normalizeModel, { FieldType } from "../helpers/normalizer";
import asyncWrapper from "../helpers/asyncWrapper";
import { v2 as cloudinary } from 'cloudinary';

import { log } from "console";
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const generateCrud = (
  model: mongoose.Model<any>,
  FIELDS: FieldType[],
  getAggregation: any[] = [
    {
      $project: {
        __v: 0,
      },
    },
  ],
  perPage: number = 5
) => {
  const getAllMethod = asyncWrapper(
      async (_req: Request, _res: Response, _next: NextFunction) => {
        if (_req.query.PNO && !/^\d+$/.test(_req.query.PNO as string))
          return _next(
            new CustomError.BadRequestError(
              "Invalid page number. Page number must be a valid integer"
            )
          );
  
        try {
          const userId = _req.user;
          const page = _req.query.PNO ? parseInt(_req.query.PNO as string) : 1;
          const skip = (page - 1) * perPage;
  
          const documents = await model.find({ ownerId: userId })
            .skip(skip)
            .limit(perPage);
  
          if (!documents || documents.length === 0) {
            _next(
              new CustomError.NotFoundError(
                `No ${model.modelName.toLowerCase()} found`
              )
            );
          } else {
            _res
              .status(StatusCodes.OK)
              .json(
                httpResponse(
                  true,
                  `${model.modelName} retrieved successfully`,
                  documents
                )
              );
          }
        } catch (error: any) {
          _next(new CustomError.BadRequestError(error.message));
        }
      }
    
  );
  

  const getByIdMethod = asyncWrapper(
      async (_req: Request, _res: Response, _next: NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(_req.params.id))
          return _next(
            new CustomError.BadRequestError(
              `Invalid ${model.modelName.toLowerCase()} id`
            )
          );
  
        try {
          const userId = _req.user; 
          const document = await model.findOne({ _id: _req.params.id });
  
          if (!document) {
            return _next(
              new CustomError.NotFoundError(`${model.modelName} not found`)
            );
          }
  
          if (document.ownerId.toString() !== userId.toString()) {
            return _next(
              new CustomError.ForbiddenError(
                "You do not have permission to access this resource"
              )
            );
          }
  
          _res
            .status(StatusCodes.OK)
            .json(
              httpResponse(
                true,
                `${model.modelName} retrieved successfully`,
                document
              )
            );
        } catch (error: any) {
          _next(new CustomError.InternalServerError(error.message));
        }
      }
    
  );
  
const postMethod = asyncWrapper(

    async (_req: Request, _res: Response, _next: NextFunction) => {
      try {
        const ownerId = _req.user;
        // const requestBody = { ..._req.body, ownerId };
        console.log("hi");
        
        
        if (!(_req as any).file) {
          _next(new CustomError.BadRequestError('No file provided'));
          return;
        }
    const result = await cloudinary.uploader.upload((_req as any).file.path);
        
        const requestBody = {
          ..._req.body,
          ownerId,
          imageurl: result.secure_url,
        };
        
        const documents = await model.create(normalizeModel(requestBody, FIELDS));
        if (!documents) {
          _next(
            new CustomError.NotFoundError(`Could not create ${model.modelName}`)
          );
        } else {
          _res
            .status(StatusCodes.CREATED)
            .json(
              httpResponse(
                true,
                `${model.modelName} created successfully`,
                documents
              )
            );
        }
      } catch (error: any) {
        console.log("fjhdifbwefui");
        
        
        _next(new CustomError.BadRequestError(error.message));
      }
    }
  
);


  const patchMethod = asyncWrapper(
      async (_req: Request, _res: Response, _next: NextFunction) => {
        let updatedDocument: any;
  
        try {
          // Assuming _req.user contains the authenticated user information
          const userId = _req.user;
  
          // Check if the user has permission to update the blog
          const existingBlog = await model.findById(_req.params.id);
  
          if (!existingBlog) {
            return _next(
              new CustomError.NotFoundError(`${model.modelName} not found`)
            );
          }
  
          if (existingBlog.ownerId.toString() !== userId.toString()) {
            return _next(
              new CustomError.ForbiddenError(
                "You do not have permission to update this resource"
              )
            );
          }
          
  
          updatedDocument = normalizeModel(_req.body, FIELDS, true);
        } catch (error: any) {
          return _next(new CustomError.BadRequestError(error.message));
        }
  
        const documents = await model.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(_req.params.id),
          },
          [
            {
              $set: updatedDocument,
            },
            {
              $project: {
                __v: 0,
              },
            },
          ],
          {
            new: true,
          }
        );
  
        if (!documents) {
          _next(new CustomError.NotFoundError(`${model.modelName} not found`));
        } else {
          _res
            .status(StatusCodes.OK)
            .json(
              httpResponse(
                true,
                `${model.modelName} updated successfully`,
                documents
              )
            );
        }
      }
    
  );
  

  const deleteMethod = asyncWrapper(
      async (_req: Request, _res: Response, _next: NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(_req.params.id))
          return _next(
            new CustomError.BadRequestError(
              `Invalid ${model.modelName.toLowerCase()} id`
            )
          );
  
        try {
          // Assuming _req.user contains the authenticated user information
          const userId = _req.user;
  
          // Check if the user has permission to delete the blog
          const existingBlog = await model.findById(_req.params.id);
  
          if (!existingBlog) {
            return _next(
              new CustomError.NotFoundError(`${model.modelName} not found`)
            );
          }
  
          if (existingBlog.ownerId.toString() !== userId.toString()) {
            return _next(
              new CustomError.ForbiddenError(
                "You do not have permission to delete this resource"
              )
            );
          }
  
          const document = await model.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(_req.params.id),
          });
  
          if (!document) {
            _next(new CustomError.NotFoundError(`${model.modelName} not found`));
          } else {
            _res
              .status(StatusCodes.NO_CONTENT)
              .json(
                httpResponse(
                  true,
                  `${model.modelName} deleted successfully`,
                  document
                )
              );
          }
        } catch (error: any) {
          _next(new CustomError.BadRequestError(error.message));
        }
      }
    
  );
  
  return {
    getAllMethod,
    getByIdMethod,
    postMethod,
    patchMethod,
    deleteMethod,
  };
};

export default generateCrud;

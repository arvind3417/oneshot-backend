import * as CustomErrors from "../errors";

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../helpers/asyncWrapper";
import generateCrud from "../helpers/generateCrud";
import * as validators from "../helpers/validators";

import { Blogs } from "../models/blog";
import { User } from "../models/user";
import { httpResponse } from "../helpers";
import mongoose from "mongoose";
const BLOGFIELDS = [
    { name: "title", validator: validators.isString, default: null,required:true },
    { name: "aboutBlog", validator: validators.isString, default: null,required:true },
    { name: "imageurl", validator: validators.isValidUrl, default:null },
    { name: "likes", validator: validators.isNumber,default:0 },
    { name: "comments", validator: validators.isNumber,default:0 },
    { name: "allComments", validator: validators.isArray,default:null },
    { name: "ownerId", validator: validators.isObjectId },



  
  ]
  

export const {
    getAllMethod: getBlogs,
    getByIdMethod: getBlog,
    postMethod: postBlog,
    patchMethod: patchBlog,
    deleteMethod: deleteBlog,
  } = generateCrud(Blogs, BLOGFIELDS);


  export const ghostBlogs = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
      try {
        const userId = _req.user
        const resultBlogs = await Blogs.find({ ownerId: { $ne: userId } })
        if (!resultBlogs) {
          _res.status(404).json({ error: 'Blogs not found' });
        } else {
          _res.json(resultBlogs);
        }
      } catch (error) {
        console.error(error);
        _next(new CustomErrors.InternalServerError("Internal server error"));
      }
    }
  );





export const likeBlog = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
        try {
            const userId = _req.user; 
            const blogId  = _req.params.id;
            if (!userId || !blogId) {
                return _next(
                    new CustomErrors.BadRequestError("Please provide userId and BlogId")
                  );
            }
            const user = await User.findOne({ _id: userId });
    
            if (!user)
            return _next(
              new CustomErrors.NotFoundError("user does not exist")
            );
    
            if (user.likedBlogs.includes(new mongoose.Types.ObjectId(blogId))) {
                _res.status(StatusCodes.OK).json(
                    httpResponse(true, "You've like the blog already", {
                    
                    })
                  );
            }
            const blog = await Blogs.findOne({ _id: blogId });
    
            if (!blog) {
                return _next(
                    new CustomErrors.NotFoundError("blog does not exist")
                  );
            }
    
            const blogUpdateResult = await Blogs.updateOne({ _id: blogId }, {
                $set: { likes: blog.likes + 1 }
            });
            const userUpdateResult = await User.updateOne({ _id: userId }, { $set: { likedBlogs: [...user.likedBlogs, blogId] } });

          if (blogUpdateResult && userUpdateResult) {
    
            _res.status(StatusCodes.OK).json(
              httpResponse(true, "Liked successfully", {
    
              })
            );
          } else {
            return _next(new CustomErrors.BadRequestError("Couldn't like"));
          }  
        } 
        catch (error) {
        _res.status(500).json({ msg: 'Error liking the blog' });
    }

 
    }
  );


  export const comment = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
      try {
        const { comment } = _req.body;
        const blogId = _req.params.id;
  
        // Input Validation
        if (!comment || !blogId) {
          return _next(
            new CustomErrors.BadRequestError("Please provide comment and BlogId")
          );
        }
  
        const userId = _req.user;
  
        const user = await User.findOne({ _id: userId });
        const username = user?.username;
  
        const blog = await Blogs.findOne({ _id: blogId });
  
        if (!blog) {
          return _next(new CustomErrors.NotFoundError("blog does not exist"));
        }
  
        // Ensure blog.allComments is an array (initialize if null or undefined)
        const allComments = Array.isArray(blog.allComments) ? blog.allComments : [];
  
        const commentResponse = await Blogs.updateOne(
          { _id: blogId },
          {
            $set: {
              comments: blog.comments + 1,
              allComments: [...allComments, { username, comment }],
            },
          }
        );
  
        if (commentResponse) {
          _res.status(StatusCodes.OK).json(
            httpResponse(true, "Commented successfully on the blog.", {})
          );
        } else {
          _res.status(StatusCodes.BAD_REQUEST).json(
            httpResponse(true, "Couldn't comment the blog", {})
          );
        }
      } catch (error) {
        console.error(error);
        _next(new CustomErrors.InternalServerError("Internal server error"));
      }
    }
  );
  
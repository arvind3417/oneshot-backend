import express from "express";
import multer from 'multer';
import {
deleteBlog,getBlog,getBlogs,patchBlog,postBlog,ghostBlogs,likeBlog,
comment
} from "../controllers/blogController";
import * as CustomError from "../errors";
import { authenticateToken } from "../middleware/authToken";
import { uploadMiddleware } from "../middleware/imageUpload";
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const blogRouter = express.Router();


blogRouter.route("/").get(authenticateToken,getBlogs).post(authenticateToken,uploadMiddleware,postBlog);
blogRouter.route("/ghost").get(authenticateToken,ghostBlogs);

blogRouter.route("/:id").get(authenticateToken,getBlog).patch(authenticateToken,patchBlog).delete(authenticateToken,deleteBlog);
blogRouter.route("/like/:id").post(authenticateToken, likeBlog);
blogRouter.route("/comment/:id").post(authenticateToken, comment);






// fallback route 
blogRouter.use((_req, _res, _next) => {
  _next(new CustomError.ForbiddenError("Only POST requests are allowed"));
});

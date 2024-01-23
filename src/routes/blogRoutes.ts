import express from "express";
import multer from 'multer';
import {
  deleteBlog, getBlog, getBlogs, patchBlog, postBlog, ghostBlogs, likeBlog,
  comment
} from "../controllers/blogController";
import * as CustomError from "../errors";
import { authenticateToken } from "../middleware/authToken";
import { uploadMiddleware } from "../middleware/imageUpload";

const storage = multer.memoryStorage();
const upload = multer({ storage });
export const blogRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: API for managing blog posts
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve a list of blogs owned by the authenticated user
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Blogs retrieved successfully
 *               data: []
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog post owned by the authenticated user
 *     responses:
 *       '201':
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Blog created successfully
 *               data: {}
 *     security:
 *       - bearerAuth: []
 */
blogRouter.route("/").get(authenticateToken, getBlogs).post(authenticateToken, uploadMiddleware, postBlog);

/**
 * @swagger
 * /blog/ghost:
 *   get:
 *     summary: Get ghost blogs
 *     description: Retrieve a list of ghost blogs
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Ghost blogs retrieved successfully
 *               data: []
 *     security:
 *       - bearerAuth: []
 */
blogRouter.route("/ghost").get(authenticateToken, ghostBlogs);

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     description: Retrieve a specific blog post owned by the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the blog post
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Blog retrieved successfully
 *               data: {}
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Update a blog by ID
 *     description: Update a specific blog post owned by the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the blog post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the blog post
 *               content:
 *                 type: string
 *                 description: Updated content of the blog post
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Blog updated successfully
 *               data: {}
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a blog by ID
 *     description: Delete a specific blog post owned by the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the blog post
 *     responses:
 *       '204':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Blog deleted successfully
 *               data: {}
 *     security:
 *       - bearerAuth: []
 */
blogRouter.route("/:id").get(authenticateToken, getBlog).patch(authenticateToken, patchBlog).delete(authenticateToken, deleteBlog);

/**
 * @swagger
 * /blog/like/{id}:
 *   post:
 *     summary: Like a blog
 *     description: Like a specific blog post owned by the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the blog post to like
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Blog liked successfully
 *               data: {}
 *     security:
 *       - bearerAuth: []
 */
blogRouter.route("/like/:id").post(authenticateToken, likeBlog);

/**
 * @swagger
 * /blog/comment/{id}:
 *   post:
 *     summary: Comment on a blog
 *     description: Comment on a specific blog post owned by the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the blog post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Comment text
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Comment added successfully
 *               data: {}
 *     security:
 *       - bearerAuth: []
 */
blogRouter.route("/comment/:id").post(authenticateToken, comment);



export default blogRouter;

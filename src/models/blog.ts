import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - aboutBlog
 *         - ownerId
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: The title of the blog.
 *         aboutBlog:
 *           type: string
 *           maxLength: 1000
 *           description: The content of the blog.
 *         imageurl:
 *           type: string
 *           description: The URL of the blog image.
 *         likes:
 *           type: number
 *           default: 0
 *           description: The number of likes for the blog.
 *         comments:
 *           type: number
 *           default: 0
 *           description: The number of comments on the blog.
 *         allComments:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *           description: An array containing all comments on the blog.
 *         ownerId:
 *           type: string
 *           format: uuid
 *           description: The ID of the owner (user) of the blog.
 */

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title can not be empty"],
        trim: true,
        maxlength: [100, "Title should be at most 100 characters"]
    },

    aboutBlog: {
        type: String,
        required: [true, "Blog field can not be empty"],
        trim: true,
        maxlength: [1000, "Blog content should be at most 1000 characters"]
    },

    imageurl: {
        type: String,
        default: "",
        validate: {
            validator: (value) => {
                // A simple regex to check if it's a valid URL (adjust as needed)
                return /^(http|https):\/\/[^ "]+$/.test(value);
            },
            message: "Invalid image URL"
        }
    },

    likes: {
        type: Number,
        default: 0
    },

    comments: {
        type: Number,
        default: 0
    },

    allComments: {
        type: Array,
        default: []
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, "Owner ID is required"]
    }
}, { timestamps: true });

export const Blogs = mongoose.model('Blog', blogSchema);

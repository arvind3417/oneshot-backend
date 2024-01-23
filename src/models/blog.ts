import mongoose from 'mongoose';

const blogSchema =new  mongoose.Schema({
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

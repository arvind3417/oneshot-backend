import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    maxlength: [30, "Username should be of length <= 30"],
    minlength: [5, "Username should be of length >= 5"]
},

email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true, // Store emails in lowercase to ensure case-insensitive uniqueness
    validate: {
        validator: (value) => {
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
        },
        message: "Invalid email format"
    }
},

password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password should be at least 8 characters long"],
    maxlength: [128, "Password is too long"], // Adjust the max length based on your security policies
    validate: {
        validator: (value) => {
            return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(value);
        },
        message: "Password must meet the complexity requirements."
    }
},    
likedBlogs: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blogs' }],
  default: []
}

});

export const User = mongoose.model('User', userSchema);
 
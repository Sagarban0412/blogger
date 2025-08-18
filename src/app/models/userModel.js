import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    email: {
      type: String,
      required: true,
      unique: true, // prevent duplicate emails
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetToken: {
      type: String,
      default: undefined,
    },

    resetTokenExpiry: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);

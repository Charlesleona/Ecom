import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    Role: {
      type: String,
      default: "user",
    },
    contact: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const user = new mongoose.model("user", schema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "manager", "supervisor", "cfo"],
      default: "user",
    },
    permissions: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      updatedetails: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      assignrole: { type: Boolean, default: true },
      changerole: { type: Boolean, default: false },
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;

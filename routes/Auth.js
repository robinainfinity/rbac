import express from "express";
import {
  register,
  login,
  logout,
  updateUser,
  forgotPassword,
  resetPassword,
} from "../controllers/Auth.js";
import authenticateUser from "../middlewares/authenticateUser.js"; // Middleware to check if the user is authenticated
import checkPermission from "../middlewares/checkPermission.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", register);
AuthRoutes.post("/login", login);
AuthRoutes.post("/logout", logout);

// Protected route for updating user details
AuthRoutes.put(
  "/update",
  authenticateUser,
  checkPermission("updatedetails"),
  updateUser
);

// Forgot password route
AuthRoutes.post("/forgot-password", forgotPassword);

// Reset password route
AuthRoutes.post("/reset-password", resetPassword);

export default AuthRoutes;

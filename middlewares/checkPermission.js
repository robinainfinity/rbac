// middleware/checkPermission.js

import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

// Middleware to check permissions
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // Extract the token from the request header
      const token = req.headers.authorization?.split(" ")[1]; // Bearer token
      if (!token) {
        return res
          .status(403)
          .json({ success: false, message: "No token provided" });
      }

      // Decode the token to get the user data
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace JWT_SECRET with your secret key
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if the user has the required permission
      if (!user.permissions[permission]) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      // Attach the user object to the request for further use
      req.user = user;
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Error checking permission:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
};

export default checkPermission;

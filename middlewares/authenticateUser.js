import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

// Middleware to authenticate the user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Authentication error", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authenticateUser;

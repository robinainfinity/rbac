import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

//check if a user is authenticated and if they have an 'admin' role.
const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    //console.log(token)
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized:No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "Unauthorized:User not found" });
    }
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized:User is not an admin" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export default isAdmin;

import express from "express";
import {
  deleteUser,
  GetUsers,
  assignRole,
  changeUserRole,
} from "../controllers/Admin.js";
//import isAdmin from "../middlewares/isAdmin.js";
import checkPermission from "../middlewares/checkPermission.js";
const AdminRoutes = express.Router();

AdminRoutes.get("/getallusers", checkPermission("read"), GetUsers);
AdminRoutes.delete("/deleteuser", checkPermission("delete"), deleteUser);

// New routes for user role management
AdminRoutes.put("/assign-role", checkPermission("assignrole"), assignRole);
AdminRoutes.put("/change-role", checkPermission("changerole"), changeUserRole);

export default AdminRoutes;

// controllers/admin.js

import UserModel from "../models/user.js";

// Get all users (Admin or users with 'read' permission)
const GetUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Delete a user (Only Admin or users with 'delete' permission can delete)
const deleteUser = async (req, res) => {
  try {
    // const userId = req.params.id;//req.param to capture dynamic value from url path
    //try
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "userId is required" });
    }
    //try
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully", user });
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Assign a role to a user (Admin or users with 'assign' permission can assign roles)
const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const validRoles = ["admin", "user", "manager", "supervisor", "cfo"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.role = role;

    // Assign permissions based on the role
    const permissions = {
      admin: {
        create: true,
        read: true,
        update: true,
        delete: true,
        assignrole: true,
        changerole: true,
      },
      user: {
        create: false,
        read: true,
        update: false,
        delete: false,
        assignrole: true,
        changerole: true,
      },
      manager: {
        create: true,
        read: true,
        update: true,
        delete: false,
        assignrole: true,
        changerole: true,
      },
      supervisor: {
        create: false,
        read: true,
        update: true,
        delete: false,
        assignrole: true,
        changerole: true,
      },
      cfo: {
        create: true,
        read: true,
        update: true,
        delete: false,
        assignrole: true,
        changerole: true,
      },
    };

    user.permissions = permissions[role];

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Role assigned to user as ${role}`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Error assigning role", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Change the role of a user (Admin or users with 'changeRole' permission can change roles)
const changeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const validRoles = ["admin", "user", "manager", "supervisor", "cfo"];

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.role = newRole;

    // Assign permissions based on the new role
    const permissions = {
      admin: {
        create: true,
        read: true,
        update: true,
        delete: true,
        assignrole: true,
        changerole: true,
      },
      user: {
        create: false,
        read: true,
        update: false,
        delete: false,
        assignrole: true,
        changerole: true,
      },
      manager: {
        create: true,
        read: true,
        update: false,
        delete: false,
        assignrole: true,
        changerole: true,
      },
      supervisor: {
        create: false,
        read: true,
        update: false,
        delete: false,
        assignrole: true,
        changerole: true,
      },
      cfo: {
        create: true,
        read: true,
        update: true,
        delete: false,
        assignrole: true,
        changerole: true,
      },
    };

    user.permissions = permissions[newRole];

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${newRole}`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Error changing user role", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { GetUsers, deleteUser, assignRole, changeUserRole };

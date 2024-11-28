import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // To generate the reset token
import nodemailer from "nodemailer"; // For sending the reset email
import UserModel from "../models/user.js";

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res
        .status(402)
        .json({ success: false, message: "User already exist please login" });
    }
    const hasePassword = await bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hasePassword,
    });
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "User resgister successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("register error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found please register" });
    }
    const isValidpassword = await bcryptjs.compare(password, user.password);
    if (!isValidpassword) {
      return res
        .status(404)
        .json({ success: false, message: "Wrong password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 259200000,
    });
    return res
      .status(200)
      .json({ success: true, message: "User login successfully", user, token });
  } catch (error) {
    console.log("login error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Extract the token from the request (cookies or Authorization header)
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    // Verify the token to identify the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Clear the token from the user's session (e.g., clearing it from cookies)
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.log("logout error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.userId; // From the authenticateUser middleware

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
    }

    if (username) {
      user.username = username;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("updateUser error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Save the reset token and expiry in the database
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send the reset token via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, //  email address for sending reset emails
        pass: process.env.EMAIL_PASS, //   App password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset.
       Please use the following link to reset your password: 
       \n\n${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.log("Forgot Password error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await UserModel.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }, // Token is valid
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined; // Clear the reset token
    user.resetTokenExpiry = undefined; // Clear the token expiry
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password successfully reset",
    });
  } catch (error) {
    console.log("Reset Password error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { register, login, logout, updateUser, forgotPassword, resetPassword };

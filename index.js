import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./routes/Auth.js";
import DbCon from "./utils/db.js";
import cookieParser from "cookie-parser";
import AdminRoutes from "./routes/Admin.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

//db connection
DbCon();

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use("/auth", AuthRoutes);
app.use("/admin", AdminRoutes);
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

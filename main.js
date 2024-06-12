require("dotenv").config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser"; // Import cookie-parser
import initWebRoute from "./routes/routes";
import configViewEngine from "./config/viewEnginee";
import initWebAdminRoute from "./routes/routesAdmin";
import initAPIRoute from "./routes/routesAPI";

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 4000;



// Tích hợp cookie-parser middleware
app.use(cookieParser());

// Kết nối cơ sở dữ liệu
const MONGOURL = process.env.MONGO_URL;
mongoose.connect(MONGOURL).then(() => {
  console.log("Database is connected successfully");
});

// Các middleware khác
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cấu hình template engine
configViewEngine(app);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Khởi tạo các tuyến đường
initWebRoute(app);
initWebAdminRoute(app);
initAPIRoute(app);

// Xử lý lỗi 404 not found
app.use((req, res) => {
  return res.render("404.ejs");
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port at http://localhost:${PORT}`);
});

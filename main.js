require("dotenv").config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport"; 
import initWebRoute from "./routes/routes";
import configViewEngine from "./config/viewEnginee";
import initWebAdminRoute from "./routes/routesAdmin";
import initAPIRoute from "./routes/routesAPI";
import initializePassport from "./middleware/passport"; 
import flash from "connect-flash";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(flash());

app.use(cookieParser());

const MONGOURL = process.env.MONGO_URL;
mongoose.connect(MONGOURL).then(() => {
  console.log("Database is connected successfully");
});

configViewEngine(app);


app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport); // Khởi tạo passport với cấu hình
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

initWebRoute(app);
initWebAdminRoute(app);
initAPIRoute(app);

app.use((req, res) => {
  return res.render("404.ejs");
});

app.listen(PORT, () => {
  console.log(`Server is running on port at http://localhost:${PORT}`);
});

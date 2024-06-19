require("dotenv").config();
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie
  if (!token) {
    return res.status(401).send("Unauthorized"); // Không có token, trả về lỗi Unauthorized
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send("Invalid token");
  }
};

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Access denied. Admins only.");
  }
};
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in first!");
  res.status(404).send("Page not found");
};
module.exports = {
  authenticateToken,
  checkAdmin,
  ensureAuthenticated,
};

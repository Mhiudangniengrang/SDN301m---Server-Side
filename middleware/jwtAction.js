require("dotenv").config();
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie
  if (!token) {
    return res.status(401).send("Unauthorized"); // Không có token, trả về lỗi Unauthorized
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
    req.user = decoded; // Lưu thông tin user vào req để sử dụng trong các xử lý tiếp theo
    next(); // Chuyển tiếp yêu cầu đến middleware hoặc route tiếp theo
  } catch (error) {
    return res.status(403).send("Invalid token"); // Token không hợp lệ, trả về lỗi Forbidden
  }
};
const checkAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Người dùng là admin, cho phép tiếp tục
  } else {
    res.status(403).send("Access denied. Admins only."); // Người dùng không phải là admin, từ chối truy cập
  }
};

module.exports = {
  authenticateToken,
  checkAdmin,
};

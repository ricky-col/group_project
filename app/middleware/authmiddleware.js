import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.token;
    
    // Fallback to Authorization header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized. Please login"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userID: decoded.userID
    };


    next();

  } catch (err) {

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again"
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    return res.status(500).json({
      message: "Server error"
    });
  }
};
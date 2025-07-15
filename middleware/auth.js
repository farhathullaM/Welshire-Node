import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
      req.user = await User.findById(decoded._id).select("-password");
      req.user.id = decoded._id;
      req.user.role = decoded.role;
      req.user.email = decoded.email;
      req.user.name = decoded.name;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Access denied");
    }
    next();
  };
};

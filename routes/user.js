import express from "express";
import {
  changeAdminToUser,
  changeUserToAdmin,
  deleteUser,
  getLoggedUserDetails,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", protect, authorizeRoles("super_admin"), getUserDetails);
router.delete("/:id", protect, authorizeRoles("super_admin"), deleteUser);
router.patch(
  "/make-admin/:id",
  protect,
  authorizeRoles("super_admin"),
  changeUserToAdmin
);
router.patch(
  "/demote-admin/:id",
  protect,
  authorizeRoles("super_admin"),
  changeAdminToUser
);
router.get(
  "/me",
  protect,
  authorizeRoles("admin", "user", "super_admin"),
  getLoggedUserDetails
);

export default router;

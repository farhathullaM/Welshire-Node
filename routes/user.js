import express from "express";
import {
  changeUserToAdmin,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.patch("/makeAdmin/:id", changeUserToAdmin);

export default router;

import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    // token: generateToken(
    //   user._id,
    //   user.role,
    //   user.activated,
    //   user.email,
    //   user.name
    // ),
  });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password is mandatory");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
});

const logoutUser = asyncHandler(async (req, res) => {});

const changeUserToAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role: "admin" },
    { new: true }
  );
});

export { registerUser, loginUser, logoutUser, changeUserToAdmin };

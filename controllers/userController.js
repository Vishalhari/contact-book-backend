const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


// @desc Register a User
// @route POST /api/v1/users/register
// @access Public
const registerUser = asyncHandler(async(req,res) => {
  const {username,email,password} = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User Already Registered");
  }

  // Hash Password 
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });

  if (user) {
    return res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  }
  res.status(400);
  throw new Error("User Data is Not valid");
});

// @desc Authenticate a User
// @route POST /api/v1/users/login
// @access Public
const loginUser = asyncHandler(async(req,res) => {
  const {email,password} = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({email});
  // Compare password with Hashed password
  if (user && (await bcrypt.compare(password,user.password))) {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      res.status(500);
      throw new Error("Missing ACCESS_TOKEN_SECRET environment variable");
    }
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    return res.status(200).json({
      accessToken,
    });
  }

  res.status(401);
  throw new Error("Email or Password is invalid");
});

// @desc Logged User Info
// @route POST /api/v1/users/current
// @access Private
const userInfo = asyncHandler(async(req,res) => {
  res.json(req.user);
});


module.exports = {
  registerUser,
  loginUser,
  userInfo
}
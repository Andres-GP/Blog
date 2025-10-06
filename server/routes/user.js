const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "secret";

// Middleware: Auth
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    req.user = await User.findById(req.userId);
    if (!req.user) return res.redirect("/login");
    res.locals.user = req.user;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login", { currentRoute: "/login" });
});

// POST LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/login");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      req.flash("error_msg", "Incorrect password");
      return res.redirect("/login");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    req.flash("success_msg", "Login successful!");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error logging in");
    res.redirect("/login");
  }
});

// REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register", {
    currentRoute: "/register",
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
});

// POST REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error_msg", "User already exists");
      return res.redirect("/login");
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    req.flash("success_msg", "Registration successful!");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error registering user");
    res.redirect("/login");
  }
});

// GUEST LOGIN
router.post("/guest", async (req, res) => {
  try {
    const guestUser = await User.create({
      username: `Guest_${Date.now()}`,
      password: await bcrypt.hash("guest", 10),
    });

    const token = jwt.sign({ userId: guestUser._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    req.flash("success_msg", "Logged in as guest!");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error logging in as guest");
    res.redirect("/login");
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.flash("success_msg", "You have logged out");
  res.redirect("/");
});

// DASHBOARD - List posts
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render("dashboard", {
      data: posts,
      currentRoute: "/dashboard",
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error loading dashboard");
    res.redirect("/");
  }
});

// ADD POST PAGE
router.get("/add-post", authMiddleware, (req, res) => {
  res.render("add-post", {
    currentRoute: "/dashboard",
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
});

// POST ADD POST
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    await Post.create({
      title: req.body.title,
      body: req.body.body,
    });
    req.flash("success_msg", "Post added successfully");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error adding post");
    res.redirect("/dashboard");
  }
});

// EDIT POST PAGE
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("edit-post", {
      data: post,
      currentRoute: "/dashboard",
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error loading post");
    res.redirect("/dashboard");
  }
});

// PUT EDIT POST
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    req.flash("success_msg", "Post edited successfully");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error editing post");
    res.redirect("/dashboard");
  }
});

// DELETE POST
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Post deleted successfully");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error deleting post");
    res.redirect("/dashboard");
  }
});

module.exports = router;

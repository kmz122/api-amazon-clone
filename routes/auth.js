const router = require("express").Router();
const User = require("../models/user");
const verifyToken = require("../middlewares/verify-token");

const jwt = require("jsonwebtoken");

// Signup route
router.post("/auth/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({
      sucess: false,
      message: "Please enter email or password.",
    });
  } else {
    let newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    await newUser.save();
    let token = jwt.sign(newUser.toJSON(), process.env.AUTH_SECRET, {
      expiresIn: 604800, // 1 week
    });

    res.json({
      sucess: true,
      token,
      message: "Sucessfully create a new user.",
    });
    try {
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
});

// Profile route
router.get("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id }).populate(
      "address"
    );

    if (foundUser) {
      res.json({
        sucess: true,
        user: foundUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Update a profile
router.put("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });

    if (foundUser) {
      if (req.body.name) foundUser.name = req.body.name;
      if (req.body.email) foundUser.email = req.body.email;
      if (req.body.password) foundUser.password = req.body.password;

      await foundUser.save();

      res.json({
        success: true,
        message: "Sucessfully updated the profile.",
      });
    }
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
});

// login route
router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) {
      res.status(403).json({
        sucess: false,
        message: "Authentication failed. User not found.",
      });
    } else {
      if (foundUser.comparedPassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.AUTH_SECRET, {
          expiresIn: 604800, // 1 Week
        });

        res.json({
          sucess: true,
          token,
        });
      } else {
        res.status(403).json({
          sucess: false,
          message: "Authentication failed. Wrong password .",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = router;

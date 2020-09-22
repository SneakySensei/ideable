const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/User");

const auth = require("../middleware/auth");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp Endpoint
 */

router.post(
  "/signup",
  [
    check("username", "Please enter a valid username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({
        email,
      });

      if (user) {
        return res.status(400).json({
          message: "User already exists. Please use a different email.",
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.secret,
        {
          expiresIn: 50000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            details: user,
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res
        .status(500)
        .send("Error in Saving. If you're server admin, check server log.");
    }
  }
);

/**
 * @method - POST
 * @param - /login
 * @description - User LogIn Endpoint
 */

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "No user found with that email. New user? Signup",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password!",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.secret,
        {
          expiresIn: 50000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            details: user,
            token,
          });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /details
 */

router.get("/details", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;

const router = require("express").Router();
const User = require("../models/user");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: cryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY,
      ).toString(),
    });
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.password });
    if (!user) return res.status(401).json("wrong credentials");
    const hashedPassword = cryptoJs.AES.decrypt(
      user.password,
      process.env.SECRET_KEY,
    ).toString();
    if (hashedPassword !== req.body.password)
      return res.status(401).json("wrong credentials");
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );
    const { password, ...others } = user._doc;
    return res.status(200).json(...others, accessToken);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

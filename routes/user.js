const {
  verifyAuthorization,
  verifyAdmin,
} = require("../middlewares/verify");
const router = require("express").Router();
const cryptoJs = require("crypto-js");
const User = require("../models/user");

router.put("/:id", verifyAuthorization, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = cryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY,
      ).toString();
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete("/:id", verifyAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("user has been deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/find/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const query = req.query.new;
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(15)
      : await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const data = await User.aggregate([
      { $match: { createdAt: { $gta: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

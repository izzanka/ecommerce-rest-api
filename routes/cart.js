const {
  verifyAdmin,
  verifyToken,
  verifyAuthorization,
} = require("../middlewares/verify");
const router = require("express").Router();
const Cart = require("../models/cart");

router.post("/", verifyToken, async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.put("/:id", verifyAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json(updatedCart);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete("/:id", verifyAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json("cart has been deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/find/:userId", verifyAuthorization, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    return res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

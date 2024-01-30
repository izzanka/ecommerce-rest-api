const {
  verifyAdmin,
  verifyToken,
  verifyAuthorization,
} = require("../middlewares/verify");
const router = require("express").Router();
const Order = require("../models/order");

router.post("/", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json("order has been deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/find/:userId", verifyAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/incomes", verifyAdmin, async (req, res) => {
  try {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1),
    );
    const incomes = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    return res.status(200).json(incomes)
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

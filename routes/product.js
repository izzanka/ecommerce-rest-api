const {
  verifyAdmin,
} = require("../middlewares/verify");
const router = require("express").Router();
const Product = require("../models/product");

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    return res.status(200).json(savedProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("product has been deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    let products;
    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(15);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

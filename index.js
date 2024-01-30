const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db connection successfully"))
  .catch((err) => {
    console.log(err);
  });

app.use("api/v1/auths", authRoute);
app.use("api/v1/users", userRoute);
app.use("api/v1/products", productRoute);
app.use("api/v1/orders", orderRoute);
app.use("api/v1/carts", cartRoute);

app.listen(process.env.PORT_NUMBER || 5000, () => {
  console.log("backend server is running");
});

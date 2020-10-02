const rounter = require("express").Router();
const router = require("express").Router();
const Order = require("../models/order");
const verifyToken = require("../middlewares/verify-token");
// const { find } = require("../models/order");

router.get("/orders", verifyToken, async (req, res) => {
  try {
    let products = await Order.find({ owner: req.decoded._id })
      .populate({
        path: "products",
        populate: {
          path: "productID",
          populate: {
            path: "owner",
          },
        },
      })
      .populate("owner")
      .exec();

    if (products) {
      res.json({
        success: true,
        products, // this is orders
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

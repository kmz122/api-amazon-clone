const router = require("express").Router();
const Review = require("../models/review");
const Product = require("../models/product");
const verifyToken = require("../middlewares/verify-token");
const upload = require("../middlewares/upload-photo");

// POST review API
router.post(
  "/reviews/:productID",
  [verifyToken, upload.single("photo")],
  async (req, res) => {
    try {
      const review = new Review();
      review.headline = req.body.headline;
      review.body = req.body.body;
      review.rating = req.body.rating;
      review.photo = req.file.path;
      review.user = req.decoded._id; // get from verifyToken
      review.productID = req.params.productID; // get from /reviews/:productID

      await Product.updateOne(
        { _id: req.params.productID },
        { $push: { reviews: review._id } }
      );
      console.log("review._id");
      console.log(review._id);
      // await Product.update({ $push: { rating: review._id } });

      const savedReview = await review.save();

      if (savedReview) {
        res.json({
          sucess: true,
          message: "Sucessfully Added Review",
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message,
      });
    }
  }
);

// GET review API
router.get("/reviews/:productID", async (req, res) => {
  try {
    const productReviews = await Review.find({
      productID: req.params.productID,
    })
      .populate("user")
      .exec();

    res.json({
      sucess: true,
      reviews: productReviews,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = router;

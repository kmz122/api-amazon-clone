const router = require("express").Router();
const Category = require("../models/category");

// POST request
router.post("/categories", async (req, res) => {
  try {
    const category = new Category();
    category.type = req.body.type;

    await category.save();

    res.json({
      sucess: true,
      message: "Sucessfully create a new category",
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: err.message,
    });
  }
});

// GET request
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      sucess: true,
      //   message: "Sucessfull get the categories",
      categories, // category: category
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: err.message,
    });
  }
});

module.exports = router;

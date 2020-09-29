const router = require("express").Router();
const Owner = require("../models/owner");

const upload = require("../middlewares/upload-photo");

// POST api
router.post("/owners", upload.single("photo"), async (req, res) => {
  try {
    const owner = new Owner();
    owner.name = req.body.name;
    owner.about = req.body.about;
    owner.photo = req.file.path;

    await owner.save();

    res.json({
      sucess: true,
      message: "A new owner is sucessfully created.",
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: err.message,
    });
  }
});

// GET request
router.get("/owners", async (req, res) => {
  try {
    const owners = await Owner.find();

    res.json({
      sucess: true,
      owners, // owners: owners
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: err.message,
    });
  }
});

module.exports = router;

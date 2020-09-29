const router = require("express").Router();
const Address = require("../models/address");
const verifyToken = require("../middlewares/verify-token");
const axios = require("axios");
const User = require("../models/user");
// const { findOne } = require("../models/address");

// POST api - Create an address
router.post("/addresses", verifyToken, async (req, res) => {
  try {
    let address = new Address();

    address.user = req.decoded._id;
    address.country = req.body.country;
    address.fullName = req.body.fullName;
    address.streetAddress = req.body.streetAddress;
    address.city = req.body.city;
    address.state = req.body.state;
    address.zipCode = req.body.zipCode;
    address.phoneNumber = req.body.phoneNumber;
    address.deliverInstructions = req.body.deliverInstructions;
    address.securityCode = req.body.securityCode;

    await address.save();

    if (address) {
      res.json({
        success: true,
        message: "Sucessfully added the Address",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET api Address // get-all-addresses-belong-to-user
router.get("/addresses", verifyToken, async (req, res) => {
  try {
    let addresses = await Address.find({ user: req.decoded._id });

    res.json({
      success: true,
      //   message: "Sucessfully get all the addresses",
      addresses, // addresses: addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//GET api - Get single address
router.get("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let address = await Address.findOne({ _id: req.params.id });

    console.log(address);

    res.json({
      success: true,
      address: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// //GET api - Get single address
// router.get("/addresses/:id", async (req, res) => {
//   try {
//     let address = await Address.findOne({ _id: req.params.id });

//     console.log(address);

//     res.json({
//       success: true,
//       address: address,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// GET countries api - get lsit of countries
router.get("/countries", async (req, res) => {
  try {
    let response = await axios.get("https://restcountries.eu/rest/v2/all");

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// EDIT address api - (also known as update or put) Update an address
router.put("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let foundAddress = await Address.findOne({
      user: req.decoded._id,
      _id: req.params.id,
    });

    if (foundAddress) {
      if (req.body.country) foundAddress.country = req.body.country;
      if (req.body.fullName) foundAddress.fullName = req.body.fullName;
      if (req.body.streetAddress)
        foundAddress.streetAddress = req.body.streetAddress;
      if (req.body.city) foundAddress.city = req.body.city;
      if (req.body.state) foundAddress.state = req.body.state;
      if (req.body.zipCode) foundAddress.zipCode = req.body.zipCode;
      if (req.body.phoneNumber) foundAddress.phoneNumber = req.body.phoneNumber;
      if (req.body.deliverInstructions)
        foundAddress.deliverInstructions = req.body.deliverInstructions;
      if (req.body.securityCode)
        foundAddress.securityCode = req.body.securityCode;
    }

    await foundAddress.save();

    res.json({
      success: true,
      message: "Successfully update the address",
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: err.message,
    });
  }
});

// DELETE address api - Delete an address
router.delete("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let deletedAddress = await Address.remove({
      user: req.decoded._id,
      _id: req.params.id,
    });

    if (deletedAddress) {
      res.json({
        success: true,
        message: "Address has been deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
});

// PUT api - Set deafult address
router.put("/addresses/set/default", verifyToken, async (req, res) => {
  try {
    let defaultAddress = await User.findOneAndUpdate(
      { _id: req.decoded._id },
      { $set: { address: req.body.id } }
    );

    if (defaultAddress) {
      res.json({
        // address_ID: req.body.id,
        success: true,
        message: "Successfully set this address as default",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//exports module
module.exports = router;

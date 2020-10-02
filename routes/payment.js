const router = require("express").Router();
const moment = require("moment");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(
  "sk_test_51HUEVKLXpJaCnclZexmcmLPvAPfBfMCApdhJqVfLd2X893FZEMGbzzO1QtRBBlnfdRqzJpi5LuGeFt5jZ9uK00QC00yUPhAg7X"
);
const verifyToken = require("../middlewares/verify-token");
const Order = require("../models/order");

const SHIPMENT = {
  normal: {
    price: 13.98,
    days: 7,
  },

  fast: {
    price: 49.98,
    days: 3,
  },
};

function shipmentPrice(shipmentOption) {
  let estimated = moment().add(shipmentOption.days, "d").format("dddd MMMM Do");
  let placedDate = moment().format("dddd MMMM Do");

  return { estimated, price: shipmentOption.price, placedDate };
}

router.post("/shipment", (req, res) => {
  let shipment;

  if (req.body.shipment === "normal") {
    shipment = shipmentPrice(SHIPMENT.normal);
  } else {
    shipment = shipmentPrice(SHIPMENT.fast);
  }

  res.json({
    success: true,
    shipment,
  });
});

/* Payment API */
router.post("/payment", verifyToken, (req, res) => {
  let totalPrice = Math.round(req.body.totalPrice * 100);

  // Create a new customer and then create an invoice item then invoice it:
  stripe.customers
    .create({
      email: req.decoded.email,
    })
    .then((customer) => {
      return stripe.customers.createSource(customer.id, {
        source: "tok_visa",
      });
    })
    .then((source) => {
      return stripe.charges.create({
        amount: totalPrice,
        currency: "usd",
        customer: source.customer,
      });
    })
    .then(async (charge) => {
      // New charge created on a new customer
      let order = new Order();
      let cart = req.body.cart;

      cart.map((product) => {
        // map the product from cart to use
        order.products.push({
          productID: product._id,
          quantity: parseInt(product.quantity),
          price: product.price,
        });
      });

      order.owner = req.decoded._id;
      order.estimatedDelivery = req.body.estimatedDelivery;
      order.placedDate = req.body.placedDate;
      order.totalPrice = totalPrice / 100;
      await order.save();
    })
    .catch((err) => {
      // Deal with an error
      console.log(err);
      console.log("Success: false");
      // res.json({
      //   success: false,
      //   message: err.message,
      // });
    });

  res.json({
    success: true,
    message: "Successfully made a payment",
  });
});

//   stripe.customers
//     .create({
//       email: req.body.email,
//     })
//     .then((customer) => {
//       return stripe.invoiceItems.create({
//         customer: customer.id,
//         amount: totalPrice,
//         currency: "usd",
//         description: "One-time setup fee",
//       });
//     })
//     .then((invoiceItem) => {
//       return stripe.invoices.create({
//         collection_method: "send_invoice",
//         customer: invoiceItem.customer,
//       });
//     })
//     .then(async (invoice) => {
//       // New invoice created on a new customer
//       let order = new Order();
//       let cart = req.body.cart;

//       cart.map((product) => {
//         // map the product from cart to use
//         order.products.push({
//           productID: product._id,
//           quantity: parseInt(product.quantity),
//           price: product.price,
//         });
//       });

//       order.owner = req.decoded._id;
//       order.estimatedDelivery = req.body.estimatedDelivery;
//       await order.save();
//     })
//     .catch((err) => {
//       // Deal with an error
//       res.status(500).json({
//         sucess: false,
//         message: err.message,
//       });
//     });
// });

// export the router
module.exports = router;

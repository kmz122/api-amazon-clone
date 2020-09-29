const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// import Vue from "vue";
// const Vue = require("vue");

//Before heroku
const compression = require("compression");
const helmet = require("helmet");

const path = require("path");
const router = express.Router();

const app = express();

dotenv.config();

const dbConnectionString = process.env.DATABASE;

mongoose.connect(
  dbConnectionString,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (err) console.log(err);
    else console.log("Connected to database");
  }
);

// console.log("typeof process.env.DATABASE: ", dbConnectionString);

//Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// if (process.env.NODE_ENV === "production") {
//   // app.use(express.static("./admin/static"));
//   app.use(express.static("./client/static"));
//   // app.use(express.static("./admin/pages"));
// }

app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, "./public")));

// require api
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const ownerRoutes = require("./routes/owner");
const userRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const addressRoutes = require("./routes/address");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");
const searchRoutes = require("./routes/search");

app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", ownerRoutes);
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);
app.use("/api", addressRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);
app.use("/api", searchRoutes);

// // go to api home address
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "public/index.html"));
// });

//listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Listening to Port: ${PORT}`);
});

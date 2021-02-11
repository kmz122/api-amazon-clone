const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


// Before deployment to heroku
// Use "helmet" to protect the well known vulnerabilities 
// And use "gzip/deflate compression" for responses
const compression = require("compression");
const helmet = require("helmet");

const path = require("path");
const router = express.Router();

const app = express();

dotenv.config();

// Conection Config to MongoDB Atlas
const dbConnectionString = process.env.DATABASE;
mongoose.connect(
  dbConnectionString,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (err) console.log(err);
    else console.log("Connected to database");
  }
);



//Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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


const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Listening to Port: ${PORT}`);
});

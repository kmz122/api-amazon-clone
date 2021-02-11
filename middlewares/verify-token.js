const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let tokenBefore =
    req.headers["x-acess-token"] || req.headers["authorization"];

  if (tokenBefore) {
    let token = tokenBefore.replace("Bearer ", "");

    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) {
        res.json({
          sucess: false,
          message: "Failed to authenticate.",
        });
      } else {
        req.decoded = decoded; // req.decoded._id = decoded is simply user obj
        next();
      }
    });
  } else {
    res.json({
      sucess: false,
      message: "No token provided.",
    });
  }
};

require("dotenv").config();
const express = require("express");
const router = express.Router();

const SpringEdgeKey = process.env.SpringEdgeKey;

const springedge = require("springedge");

router.post(process.env.otpRoute, (req, res) => {
  const MobileNumber = req.body.to;
  const Body = `Your OTP for Courierdo registration is: ${req.body.otp}`;

  const params = {
    apikey: SpringEdgeKey, // API Key
    sender: "INFTXT", // Sender Name
    to: MobileNumber, //Mobile Number
    message: Body,
    format: "json",
  };

  springedge.messages.send(params, 5000, function (err, response) {
    if (err) {
      return res.send({
        msg: "fail",
      });
    } else {
      return res.send({
        msg: "success",
      });
    }
  });
});

module.exports = router;

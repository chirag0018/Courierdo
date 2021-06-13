require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Price = mongoose.model("PriceDb");

router.post(process.env.changeprice, (req, res) => {
  perKm = req.body.perKm;
  uptoOnekg = req.body.oneKg;
  uptoFivekg = req.body.fiveKg;
  uptoTenkg = req.body.tenKg;
  uptoFifteenkg = req.body.fifteenKg;
  uptoTwentykg = req.body.twentyKg;

  Price.findOne().then((charges) => {
    if (charges === null) {
      const savePrice = new Price({
        perKm,
        uptoOnekg,
        uptoFivekg,
        uptoTenkg,
        uptoFifteenkg,
        uptoTwentykg,
      });
      savePrice.save((err, result) => {
        if (err) {
          return res.send({ msg: "fail" });
        } else {
          return res.send({ msg: "success" });
        }
      });
    } else {
      Price.findOneAndUpdate(
        {},
        {
          $set: {
            perKm,
            uptoOnekg,
            uptoFivekg,
            uptoTenkg,
            uptoFifteenkg,
            uptoTwentykg,
          },
        },
        { new: true }
      )
        .then(() => {
          return res.send({ msg: "success" });
        })
        .catch(() => {
          return res.send({ msg: "fail" });
        });
    }
  });
});

router.post(process.env.fetchPrice, (req, res) => {
  Price.findOne()
    .then((price) => {
      return res.send(price);
    })
    .catch(() => {
      return res.send({ msg: "fail" });
    });
});

module.exports = router;

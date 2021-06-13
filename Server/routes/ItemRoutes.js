require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Item = mongoose.model("ItemDb");

router.post(process.env.saveitem, (req, res) => {
  ipAddress = req.body.ipAddress;
  fromMobileNumber = req.body.fromMobileNumber;
  fromAddress = req.body.fromAddress;
  toMobileNumber = req.body.toMobileNumber;
  toAddress = req.body.toAddress;
  charges = req.body.charges;
  weight = req.body.weight;
  deliveryOption = req.body.deliveryOption;
  departDate = req.body.departDate;
  departTime = req.body.departTime;
  arriveDate = req.body.arriveDate;
  arriveTime = req.body.arriveTime;
  instructions = req.body.instructions;
  isOrderAccepted = "NotDefined";
  isOrderDelivered = "NotDelivered";
  secureParcel = req.body.secureParcel;
  deliveryItemName = req.body.deliveryItemName;

  const saveItem = new Item({
    ipAddress,
    fromMobileNumber,
    fromAddress,
    toMobileNumber,
    toAddress,
    charges,
    weight,
    deliveryOption,
    departDate,
    departTime,
    arriveDate,
    arriveTime,
    instructions,
    isOrderAccepted,
    isOrderDelivered,
    secureParcel,
    deliveryItemName,
  });

  saveItem.save((err, result) => {
    if (err) {
      return res.send({ msg: "fail" });
    } else {
      return res.send({ msg: "success" });
    }
  });
});

router.post(process.env.fetchnotreviewitemRoute, (req, res) => {
  const isOrderAccepted = "NotDefined";
  const page = req.body.page;
  const limit = 12;

  Item.find({ isOrderAccepted })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .then((items) => {
      return res.send(items);
    })
    .catch(() => {
      return res.send({ msg: "fail" });
    });
});

router.post(process.env.ReviewItemRoute, (req, res) => {
  const id = req.body.id;
  const value =
    req.body.review === "Accept" ? "OrderAccepted" : "OrderNotAccepted";
  const isOrderDelivered =
    req.body.review === "Accept" ? "NotDelivered" : "Delivered";

  Item.findOneAndUpdate(
    { _id: id },
    { $set: { isOrderAccepted: value, isOrderDelivered } },
    { new: true }
  )
    .then(() => {
      return res.send({ msg: "success" });
    })
    .catch(() => {
      return res.send({ msg: "fail" });
    });
});

router.post(process.env.fetchacceptitemRoute, (req, res) => {
  const isOrderAccepted = "OrderAccepted";
  const isOrderDelivered = "NotDelivered";
  const page = req.body.page;
  const limit = 12;

  Item.find({ isOrderAccepted, isOrderDelivered })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .then((items) => {
      return res.send(items);
    })
    .catch(() => {
      return res.send({ msg: "fail" });
    });
});

router.post(process.env.DeliveredItemRoute, (req, res) => {
  const id = req.body.id;
  const value = "Delivered";

  Item.findOneAndUpdate(
    { _id: id },
    { $set: { isOrderDelivered: value } },
    { new: true }
  )
    .then(() => {
      return res.send({ msg: "success" });
    })
    .catch(() => {
      return res.send({ msg: "fail" });
    });
});

router.post(process.env.fetchdelivereditemRoute, (req, res) => {
  const isOrderAccepted = "NotDefined";
  const isOrderDelivered = "NotDelivered";
  const page = req.body.page;
  const limit = 12;

  Item.find({
    isOrderAccepted: { $ne: isOrderAccepted },
    isOrderDelivered: { $ne: isOrderDelivered },
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .then((items) => {
      return res.send(items);
    })
    .catch(() => {
      return res.send({ msg: "fail" });
    });
});

router.post(process.env.fetchmyordersitemRoute, (req, res) => {
  const ipAddress = req.body.ipAddress;
  const page = req.body.page;
  const limit = 12;

  Item.find({
    ipAddress,
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .then((items) => {
      return res.send(items);
    })
    .catch(() => {
      return res.send({ msg: "fail" });
    });
});

module.exports = router;

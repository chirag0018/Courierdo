const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
    },
    fromMobileNumber: {
      type: String,
      required: true,
    },
    fromAddress: {
      type: String,
      required: true,
    },
    toMobileNumber: {
      type: String,
      required: true,
    },
    toAddress: {
      type: String,
      required: true,
    },
    charges: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    deliveryOption: {
      type: String,
      required: true,
    },
    departDate: {
      type: String,
    },
    departTime: {
      type: String,
    },
    arriveDate: {
      type: String,
    },
    arriveTime: {
      type: String,
    },
    instructions: {
      type: String,
    },
    isOrderAccepted: {
      type: String,
      required: true,
    },
    isOrderDelivered: {
      type: String,
      required: true,
    },
    secureParcel: {
      type: String,
      required: true,
    },
    deliveryItemName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItemDb", itemSchema);

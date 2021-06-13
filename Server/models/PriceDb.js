const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    perKm: {
      type: String,
      required: true,
    },
    uptoOnekg: {
      type: String,
      required: true,
    },
    uptoFivekg: {
      type: String,
      required: true,
    },
    uptoTenkg: {
      type: String,
      required: true,
    },
    uptoFifteenkg: {
      type: String,
      required: true,
    },
    uptoTwentykg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PriceDb", priceSchema);

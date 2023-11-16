const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value === "FOR_SALE" || value === "SOLD_OUT";
      },
    },
    default: "FOR_SALE",
  },
  createdAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Products", productsSchema);

const { default: mongoose } = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Dashboard", dashboardSchema);

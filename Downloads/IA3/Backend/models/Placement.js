const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  placementStatus: { type: String, default: "Pending" },
  lpa: { type: Number },
});

module.exports = mongoose.model("Placement", placementSchema);

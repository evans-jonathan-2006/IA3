// models/Student.js
const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  name: { type: String },
  companyName: { type: String, required: true },
  placementStatus: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  lpa: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  placements: { type: [PlacementSchema], default: [] }, // <- allow multiple entries
  resume: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', StudentSchema);

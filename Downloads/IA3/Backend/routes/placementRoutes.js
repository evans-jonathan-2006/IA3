const express = require("express");
const Placement = require("../models/Placement"); // ✅ using require

const router = express.Router();

// POST: Add Placement
router.post("/", async (req, res) => {
  try {
    const placement = new Placement(req.body);
    await placement.save();
    res.status(201).json(placement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Get all placements
router.get("/", async (req, res) => {
  try {
    const placements = await Placement.find();
    res.status(200).json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

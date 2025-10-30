// adminRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const Student = require("../models/Student");

router.get("/students", verifyToken, isAdmin, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;

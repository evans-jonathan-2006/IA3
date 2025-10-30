const express = require('express');
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// -----------------------
// Multer setup (optional for resume upload)
// -----------------------
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// -----------------------
// STUDENT ROUTES
// -----------------------

// ✅ Add placement info (Student)
router.post('/add', auth, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: 'Authentication required' });

    const { name, companyName, placementStatus, lpa } = req.body;

    if (!companyName || !placementStatus) {
      return res.status(400).json({ msg: 'companyName and placementStatus are required' });
    }

    const lpaNum =
      lpa !== undefined && lpa !== null && lpa !== '' ? Number(lpa) : undefined;

    if (lpa !== undefined && isNaN(lpaNum)) {
      return res.status(400).json({ msg: 'lpa must be a number' });
    }

    // Find existing student for this user/email
    let student = await Student.findOne({
      $or: [{ assignedUser: req.user.id }, { email: req.user.email }],
    });

    const placement = {
      name,
      companyName,
      placementStatus,
      ...(lpaNum !== undefined ? { lpa: lpaNum } : {}),
    };

    if (!student) {
      // Create new student with first placement
      student = new Student({
        name: name || req.user.name || '',
        email: req.user.email || '',
        assignedUser: req.user.id,
        placements: [placement],
      });
    } else {
      // Add placement to placements array
      student.placements.push(placement);
    }

    await student.save();
    return res.status(201).json(student);
  } catch (err) {
    console.error('Error adding placement info:', err);
    return res
      .status(500)
      .json({ msg: 'Error adding placement info', error: err.message });
  }
});

// ✅ Get student's own entries (return all placements)
router.get('/my', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ assignedUser: req.user.id });

    if (!student)
      return res.status(404).json({ msg: 'No student record found' });

    // Combine all placements into a flat array
    const allPlacements = [];

    // If old top-level data exists (legacy record)
    if (student.companyName && student.lpa && student.placementStatus) {
      allPlacements.push({
        name: student.name,
        companyName: student.companyName,
        placementStatus: student.placementStatus,
        lpa: student.lpa,
      });
    }

    // Add all array placements
    if (Array.isArray(student.placements)) {
      student.placements.forEach((p) => {
        allPlacements.push({
          name: student.name,
          companyName: p.companyName,
          placementStatus: p.placementStatus,
          lpa: p.lpa,
        });
      });
    }

    res.status(200).json(allPlacements);
  } catch (err) {
    console.error('Error fetching placements:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// -----------------------
// ADMIN ROUTES
// -----------------------

// ✅ Admin: Get all students
router.get('/all', auth, role(['admin']), async (req, res) => {
  try {
    const students = await Student.find().populate('assignedUser', 'name email');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error fetching all students' });
  }
});

// ✅ Admin: Update student
router.put('/:id', auth, role(['admin']), async (req, res) => {
  try {
    const { name, companyName, placementStatus, lpa } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, companyName, placementStatus, lpa },
      { new: true }
    );
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error updating student' });
  }
});

// ✅ Admin: Delete student
router.delete('/:id', auth, role(['admin']), async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error deleting student' });
  }
});

module.exports = router;

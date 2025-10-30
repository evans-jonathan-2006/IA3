const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ✅ Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Token valid for 1 day
  );
};

// ========================
//  SIGNUP CONTROLLER
// ========================
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user (password hash happens in model)
    user = new User({
      name,
      email,
      password,
      role: role || 'user', // Default role = user
    });

    await user.save();

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during signup');
  }
};

// ========================
//  LOGIN CONTROLLER
// ========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Optional: Check if active
    if (user.isActive === false) {
      return res.status(403).json({ msg: 'Account is deactivated' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // ✅ Include role, name, email in token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during login');
  }
};

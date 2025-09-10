const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success:false, message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success:false, message: 'User exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role: role || 'student' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ success:true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }, message: 'Account created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success:false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success:false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success:true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: err.message });
  }
};

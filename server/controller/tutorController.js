const User = require('../models/userModel.js');

exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor' }).select('-password');
    res.json({ success:true, tutors });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

exports.getTutor = async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id).select('-password');
    if (!tutor) return res.status(404).json({ success:false, message: 'Not found' });
    res.json({ success:true, tutor });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    const { bio, subjects, hourlyRate } = req.body;
    if (bio !== undefined) updates.bio = bio;
    if (subjects !== undefined) updates.subjects = Array.isArray(subjects) ? subjects : subjects.split(',').map(s=>s.trim());
    if (hourlyRate !== undefined) updates.hourlyRate = hourlyRate;
    const tutor = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ success:true, tutor });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

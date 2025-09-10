const express = require('express');
const router = express.Router();
const { getAllTutors, getTutor, updateProfile } = require('../controllers/tutorController');
const { requireAuth, isTutor } = require('../middleware/auth');

router.get('/', getAllTutors);
router.get('/:id', getTutor);
router.put('/me', requireAuth, isTutor, updateProfile);

module.exports = router;
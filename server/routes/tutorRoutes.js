import express from 'express'
import {
    tutorSignup,
    tutorLogin,
    tutorLogout,
    getTutorProfile,
    updateTutorProfile,
    getAllTutors,
    getSingleTutor,
    updateAvailability,
    addReview
} from '../controller/tutorController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js'

const router = express.Router()

// Public routes
router.post('/signup', upload.single('avatar'), tutorSignup)
router.post('/login', tutorLogin)
router.get('/logout', tutorLogout)
router.get('/all', getAllTutors)             // GET /api/v1/tutor/all?subject=math&minRate=10
router.get('/:id', getSingleTutor)          // GET /api/v1/tutor/:id

// Protected routes (tutor must be logged in)
router.get('/profile/me', isLoggedIn, getTutorProfile)
router.put('/update', isLoggedIn, upload.single('avatar'), updateTutorProfile)
router.put('/availability', isLoggedIn, updateAvailability)

// Student adds review to tutor
router.post('/:id/review', isLoggedIn, addReview)

export default router

import express from 'express'
import {
    createBooking,
    getStudentBookings,
    getTutorBookings,
    updateBookingStatus,
    cancelBooking,
    getAllBookings
} from '../controller/bookingController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', isLoggedIn, createBooking)                          // Student books a lesson
router.get('/student', isLoggedIn, getStudentBookings)               // Student views their bookings
router.get('/tutor', isLoggedIn, getTutorBookings)                   // Tutor views their bookings
router.put('/:id/status', isLoggedIn, updateBookingStatus)           // Tutor confirms/cancels
router.put('/:id/cancel', isLoggedIn, cancelBooking)                 // Student cancels
router.get('/all', isLoggedIn, getAllBookings)                        // Admin views all bookings

export default router

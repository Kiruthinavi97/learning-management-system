import express from 'express'
import {
    createBookingOrder,
    verifyBookingPayment,
    getStudentBookings,
    getTutorBookings,
    updateBookingStatus,
    cancelBooking,
    getAllBookings
} from '../controller/bookingController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/order', isLoggedIn, createBookingOrder)           // Step 1: Create Razorpay order
router.post('/verify', isLoggedIn, verifyBookingPayment)        // Step 2: Verify payment & confirm booking
router.get('/student', isLoggedIn, getStudentBookings)          // Student bookings
router.get('/tutor', isLoggedIn, getTutorBookings)              // Tutor bookings
router.get('/all', isLoggedIn, getAllBookings)                   // Admin all bookings
router.put('/:id/status', isLoggedIn, updateBookingStatus)      // Tutor confirms/cancels
router.put('/:id/cancel', isLoggedIn, cancelBooking)            // Student cancels

export default router

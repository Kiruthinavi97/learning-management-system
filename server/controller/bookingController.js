import Booking from '../models/bookingModel.js'
import Tutor from '../models/tutorModel.js'
import User from '../models/userModel.js'
import createError from '../utils/error.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})

// Create Razorpay Order for booking
export const createBookingOrder = async (req, res, next) => {
    try {
        const { tutorId, date, time, duration, notes } = req.body
        const studentId = req.user.id

        const tutor = await Tutor.findById(tutorId)
        if (!tutor) return next(createError(404, 'Tutor not found'))

        // ✅ Check time conflict
        const conflict = await Booking.findOne({
            tutor: tutorId,
            date,
            time,
            status: { $in: ['pending', 'confirmed'] }
        })
        if (conflict) {
            return next(createError(400, 'This time slot is already booked. Please choose a different time.'))
        }

        const amount = tutor.hourlyRate * (duration || 1)

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // paise
            currency: 'INR',
            receipt: `booking_${Date.now()}`,
            notes: { tutorId, studentId: studentId.toString(), date, time, duration }
        })

        res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order,
            tutor: { name: tutor.name, subject: tutor.subject, hourlyRate: tutor.hourlyRate },
            amount,
            bookingDetails: { tutorId, date, time, duration, notes }
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Verify payment and confirm booking
export const verifyBookingPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body
        const studentId = req.user.id

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(sign)
            .digest('hex')

        if (expectedSign !== razorpay_signature) {
            return next(createError(400, 'Payment verification failed'))
        }

        const tutor = await Tutor.findById(bookingDetails.tutorId)
        const student = await User.findById(studentId)
        const amount = tutor.hourlyRate * (bookingDetails.duration || 1)

        const booking = await Booking.create({
            student: studentId,
            studentName: student.name,
            studentEmail: student.email,
            tutor: bookingDetails.tutorId,
            tutorName: tutor.name,
            date: bookingDetails.date,
            time: bookingDetails.time,
            duration: bookingDetails.duration || 1,
            amount,
            notes: bookingDetails.notes,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            paymentStatus: 'paid',
            status: 'pending'
        })

        // Update tutor earnings
        tutor.earnings.total += amount
        tutor.earnings.history.push({ amount, studentName: student.name, lessonId: booking._id })
        await tutor.save()

        res.status(201).json({
            success: true,
            message: 'Booking confirmed and payment successful!',
            booking
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Get Student Bookings
export const getStudentBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ student: req.user.id })
            .populate('tutor', 'name subject avatar hourlyRate')
            .sort({ createdAt: -1 })
        res.status(200).json({ success: true, bookings })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Get Tutor Bookings
export const getTutorBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ tutor: req.user.id })
            .populate('student', 'name email avatar')
            .sort({ createdAt: -1 })
        res.status(200).json({ success: true, bookings })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Update Booking Status
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status, meetingLink } = req.body
        const booking = await Booking.findById(id)
        if (!booking) return next(createError(404, 'Booking not found'))
        booking.status = status
        if (meetingLink) booking.meetingLink = meetingLink
        await booking.save()
        res.status(200).json({ success: true, message: `Booking ${status}`, booking })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Cancel Booking
export const cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        const booking = await Booking.findById(id)
        if (!booking) return next(createError(404, 'Booking not found'))
        booking.status = 'cancelled'
        await booking.save()
        res.status(200).json({ success: true, message: 'Booking cancelled' })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Admin - All Bookings with payment history
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('student', 'name email avatar')
            .populate('tutor', 'name subject')
            .sort({ createdAt: -1 })
        res.status(200).json({ success: true, bookings })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

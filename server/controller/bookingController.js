import Booking from '../models/bookingModel.js'
import Tutor from '../models/tutorModel.js'
import User from '../models/userModel.js'
import createError from '../utils/error.js'

// Create Booking
export const createBooking = async (req, res, next) => {
    try {
        const { tutorId, date, time, duration, notes } = req.body
        const studentId = req.user.id

        const tutor = await Tutor.findById(tutorId)
        if (!tutor) return next(createError(404, 'Tutor not found'))

        const student = await User.findById(studentId)
        if (!student) return next(createError(404, 'Student not found'))

        const amount = tutor.hourlyRate * (duration || 1)

        const booking = await Booking.create({
            student: studentId,
            studentName: student.name,
            studentEmail: student.email,
            tutor: tutorId,
            tutorName: tutor.name,
            date,
            time,
            duration: duration || 1,
            amount,
            notes
        })

        res.status(201).json({
            success: true,
            message: 'Lesson booked successfully!',
            booking
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Get Student Bookings
export const getStudentBookings = async (req, res, next) => {
    try {
        const studentId = req.user.id
        const bookings = await Booking.find({ student: studentId })
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
        const tutorId = req.user.id
        const bookings = await Booking.find({ tutor: tutorId })
            .populate('student', 'name email avatar')
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, bookings })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Update Booking Status (tutor confirms/cancels)
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status, meetingLink } = req.body

        const booking = await Booking.findById(id)
        if (!booking) return next(createError(404, 'Booking not found'))

        booking.status = status
        if (meetingLink) booking.meetingLink = meetingLink
        await booking.save()

        res.status(200).json({
            success: true,
            message: `Booking ${status} successfully`,
            booking
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Cancel Booking (student)
export const cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        const booking = await Booking.findById(id)
        if (!booking) return next(createError(404, 'Booking not found'))

        booking.status = 'cancelled'
        await booking.save()

        res.status(200).json({ success: true, message: 'Booking cancelled successfully' })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Admin - Get All Bookings
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('student', 'name email')
            .populate('tutor', 'name subject')
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, bookings })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

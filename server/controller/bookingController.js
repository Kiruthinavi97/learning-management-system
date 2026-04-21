import Booking from '../models/bookingModel.js'
import Tutor from '../models/tutorModel.js'
import User from '../models/userModel.js'
import createError from '../utils/error.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { isValidObjectId } from 'mongoose' // Recommended for safety

// ✅ Lazy init for Razorpay
function getRazorpay() {
    if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
        throw new Error('Razorpay credentials not configured in environment variables')
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET
    })
}

// ✅ Helper to resolve Student ID from Name/Email/ID
const resolveStudentId = async (input, currentUser) => {
    // If not an admin or no input provided, return logged-in user ID
    if (currentUser.role !== 'ADMIN' || !input) return currentUser.id;

    // If input is already a valid MongoDB ID, return it
    if (isValidObjectId(input)) return input;

    // Otherwise, search for the student by Name or Email
    const student = await User.findOne({
        $or: [
            { name: input },
            { email: input }
        ]
    });

    if (!student) throw createError(404, "No student found with that name or email");
    return student._id;
};

// ✅ Create Razorpay Order for booking
export const createBookingOrder = async (req, res, next) => {
    try {
        const { tutorId, date, time, duration, notes, selectedStudentId } = req.body;
        
        // Use the helper to find the correct student ID
        const studentId = await resolveStudentId(selectedStudentId, req.user);

        const tutor = await Tutor.findById(tutorId);
        if (!tutor) return next(createError(404, 'Tutor not found'));

        // Check time conflict
        const conflict = await Booking.findOne({
            tutor: tutorId,
            date,
            time,
            status: { $in: ['pending', 'confirmed'] }
        });
        
        if (conflict) return next(createError(400, 'This time slot is already booked.'));

        const amount = tutor.hourlyRate * (duration || 1);
        const razorpay = getRazorpay();

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `booking_${Date.now()}`,
            notes: { tutorId, studentId: studentId.toString(), date, time, duration }
        });

        res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_API_KEY,
            order,
            tutor: { name: tutor.name, subject: tutor.subject, hourlyRate: tutor.hourlyRate },
            amount,
            // Pass the resolved studentId back so the verify step knows who it is
            bookingDetails: { tutorId, date, time, duration, notes, resolvedStudentId: studentId }
        });
    } catch (error) {
        return next(createError(error.status || 500, error.message));
    }
}

// ✅ Verify payment and confirm booking
export const verifyBookingPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body;

        // Use the student ID resolved in the previous step
        const finalStudentId = bookingDetails.resolvedStudentId || req.user.id;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(sign)
            .digest('hex');

        if (expectedSign !== razorpay_signature) {
            return next(createError(400, 'Payment verification failed'));
        }

        const tutor = await Tutor.findById(bookingDetails.tutorId);
        const student = await User.findById(finalStudentId);
        
        if (!student) return next(createError(404, 'Student user not found'));

        const amount = tutor.hourlyRate * (bookingDetails.duration || 1);

        const booking = await Booking.create({
            student: finalStudentId,
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
        });

        // Update tutor earnings
        if (!tutor.earnings) tutor.earnings = { total: 0, history: [] };
        tutor.earnings.total += amount;
        tutor.earnings.history.push({ amount, studentName: student.name, lessonId: booking._id });
        await tutor.save();

        res.status(201).json({
            success: true,
            message: 'Booking confirmed and payment successful!',
            booking
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
}
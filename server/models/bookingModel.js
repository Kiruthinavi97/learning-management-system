import { Schema, model } from 'mongoose'

const bookingSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: String,
    studentEmail: String,
    tutor: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    tutorName: String,
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 1 },
    amount: { type: Number, required: true },
    notes: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    meetingLink: { type: String, default: '' },
    // Payment fields
    paymentId: { type: String, default: '' },
    orderId: { type: String, default: '' },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    }
}, { timestamps: true })

const Booking = model('Booking', bookingSchema)
export default Booking

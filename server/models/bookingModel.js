import { Schema, model } from 'mongoose'

const bookingSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentName: String,
    studentEmail: String,
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    tutorName: String,
    date: {
        type: String,
        required: [true, 'Date is required']
    },
    time: {
        type: String,
        required: [true, 'Time is required']
    },
    duration: {
        type: Number,
        default: 1
    },
    amount: {
        type: Number,
        required: true
    },
    notes: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    meetingLink: {
        type: String,
        default: ''
    }
}, { timestamps: true })

const Booking = model('Booking', bookingSchema)
export default Booking

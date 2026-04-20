import { Schema, model } from 'mongoose'

const paymentSchema = new Schema({
    payment_id: { type: String, required: true },
    subscription_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    courseId: { type: String, default: '' },
    courseTitle: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, default: 499 },
    status: { type: String, default: 'captured' }
}, { timestamps: true })

export const Payment = model('Payment', paymentSchema)

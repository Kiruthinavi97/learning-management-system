import { Payment } from '../models/paymentModel.js'
import User from '../models/userModel.js'
import createError from '../utils/error.js'
import crypto from 'crypto'
import Razorpay from 'razorpay'

// Lazy init Razorpay
function getRazorpay() {
    return new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET
    })
}

// Get Razorpay Key
export const getRazorpayKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "razorpay key",
        key: process.env.RAZORPAY_API_KEY
    })
}

// ✅ Create per-course Razorpay Order (₹499 per course)
export const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user
        const { courseId, courseTitle } = req.body

        const user = await User.findById(id)
        if (!user) return next(createError(404, "Please log in again"))
        if (user.role === 'ADMIN') return next(createError(400, "Admin cannot purchase a subscription"))

        // ✅ Check if already subscribed to this course
        const alreadySubscribed = user.subscription.courses?.some(
            c => c.courseId?.toString() === courseId?.toString() && c.status === 'active'
        )
        if (alreadySubscribed) {
            return res.status(200).json({
                success: false,
                message: "You are already subscribed to this course"
            })
        }

        const razorpay = getRazorpay()

        // Create one-time order for ₹499
        const order = await razorpay.orders.create({
            amount: 49900, // ₹499 in paise
            currency: 'INR',
            receipt: `course_${courseId}_${Date.now()}`,
            notes: { courseId, courseTitle, userId: id.toString() }
        })

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            subscription_id: order.id, // keep same key for frontend compatibility
            order_id: order.id,
            key: process.env.RAZORPAY_API_KEY,
            amount: order.amount,
            courseId,
            courseTitle
        })
    } catch (error) {
        console.error("BUY COURSE ERROR:", error.message)
        return next(createError(500, error.message))
    }
}

// ✅ Verify per-course payment and activate subscription
export const verifySubscription = async (req, res, next) => {
    try {
        const { id } = req.user
        const { payment_id, razorpay_signature, subscription_id, courseId, courseTitle } = req.body

        const user = await User.findById(id)
        if (!user) return next(createError(400, "Please log in again"))

        // Verify signature
        const generateSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(`${subscription_id}|${payment_id}`)
            .digest('hex')

        if (generateSignature !== razorpay_signature) {
            return next(createError(400, "Payment not verified, please try again"))
        }

        // Save payment record
        await Payment.create({
            payment_id,
            subscription_id,
            razorpay_signature,
            courseId,
            userId: id
        })

        // ✅ Add course to user's subscribed courses
        if (!user.subscription.courses) {
            user.subscription.courses = []
        }

        // Remove existing entry for this course if any
        user.subscription.courses = user.subscription.courses.filter(
            c => c.courseId?.toString() !== courseId?.toString()
        )

        // Add new active subscription
        user.subscription.courses.push({
            courseId,
            courseTitle,
            status: 'active',
            subscribedAt: new Date()
        })

        // Keep backward compatibility - set status active if at least one course
        user.subscription.status = 'active'

        await user.save()

        res.status(200).json({
            success: true,
            message: "Payment successful! You now have access to this course."
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// ✅ Cancel specific course subscription
export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user
        const { courseId } = req.body

        const user = await User.findById(id)
        if (!user) return next(createError(400, "Please log in again"))
        if (user.role === 'ADMIN') return next(createError(400, "You are not allowed to do this"))

        if (!courseId) {
            return next(createError(400, "Course ID is required"))
        }

        // Find the payment for this course
        const payment = await Payment.findOne({
            courseId,
            userId: id
        }).sort({ createdAt: -1 })

        if (!payment) {
            return next(createError(404, "Payment not found for this course"))
        }

        // Check refund eligibility (14 days)
        const timeSinceSubscribed = Date.now() - new Date(payment.createdAt).getTime()
        const refundPeriod = 14 * 24 * 60 * 60 * 1000

        if (timeSinceSubscribed <= refundPeriod) {
            const razorpay = getRazorpay()
            try {
                await razorpay.payments.refund(payment.payment_id, { speed: 'optimum' })
            } catch (refundError) {
                return next(createError(500, "Refund failed: " + refundError.message))
            }
        }

        // Remove course from subscription
        user.subscription.courses = user.subscription.courses.filter(
            c => c.courseId?.toString() !== courseId?.toString()
        )

        // Update overall status
        if (user.subscription.courses.length === 0) {
            user.subscription.status = undefined
        }

        await user.save()
        await payment.deleteOne()

        res.status(200).json({
            success: true,
            message: timeSinceSubscribed <= refundPeriod
                ? "Subscription cancelled and refund initiated"
                : "Subscription cancelled (refund period expired)"
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Get all payments (Admin)
export const allPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })

        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

        const finalMonths = {}
        monthNames.forEach(m => finalMonths[m] = 0)

        payments.forEach(payment => {
            const month = monthNames[new Date(payment.createdAt).getMonth()]
            finalMonths[month] += 1
        })

        const monthlySalesRecord = Object.values(finalMonths)

        res.status(200).json({
            success: true,
            message: 'All payments',
            allPayments: { items: payments, count: payments.length },
            finalMonths,
            monthlySalesRecord,
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

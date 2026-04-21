import { Payment } from '../models/paymentModel.js'
import User from '../models/userModel.js'
import createError from '../utils/error.js'
import crypto from 'crypto'
import Razorpay from 'razorpay'

function getRazorpay() {
    return new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET
    })
}

export const getRazorpayKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "razorpay key",
        key: process.env.RAZORPAY_API_KEY
    })
}

export const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user
        const { courseId, courseTitle } = req.body

        const user = await User.findById(id)
        if (!user) return next(createError(404, "Please log in again"))
        if (user.role === 'ADMIN') return next(createError(400, "Admin cannot purchase a subscription"))

        // ✅ Safe init - handle old users without courses array
        if (!user.subscription) user.subscription = {}
        if (!user.subscription.courses) user.subscription.courses = []

        // Check if already subscribed to this course
        const alreadySubscribed = user.subscription.courses.some(
            c => c.courseId?.toString() === courseId?.toString() && c.status === 'active'
        )
        if (alreadySubscribed) {
            return res.status(200).json({
                success: false,
                message: "You are already subscribed to this course"
            })
        }

        const razorpay = getRazorpay()
        const order = await razorpay.orders.create({
            amount: 49900,
            currency: 'INR',
            receipt: `course_${Date.now()}`,
            notes: { courseId: courseId || '', courseTitle: courseTitle || '', userId: id.toString() }
        })

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            subscription_id: order.id,
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

export const verifySubscription = async (req, res, next) => {
    try {
        const { id } = req.user
        const { payment_id, razorpay_signature, subscription_id, courseId, courseTitle } = req.body

        const user = await User.findById(id)
        if (!user) return next(createError(400, "Please log in again"))

        const generateSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(`${subscription_id}|${payment_id}`)
            .digest('hex')

        if (generateSignature !== razorpay_signature) {
            return next(createError(400, "Payment not verified, please try again"))
        }

        await Payment.create({
            payment_id,
            subscription_id,
            razorpay_signature,
            courseId: courseId || '',
            courseTitle: courseTitle || '',
            userId: id,
            amount: 499
        })

        // ✅ Safe init
        if (!user.subscription) user.subscription = {}
        if (!user.subscription.courses) user.subscription.courses = []

        user.subscription.courses = user.subscription.courses.filter(
            c => c.courseId?.toString() !== courseId?.toString()
        )
        user.subscription.courses.push({
            courseId,
            courseTitle,
            status: 'active',
            subscribedAt: new Date()
        })
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

export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user
        const { courseId } = req.body
        const user = await User.findById(id)
        if (!user) return next(createError(400, "Please log in again"))
        if (user.role === 'ADMIN') return next(createError(400, "Not allowed"))
        if (!courseId) return next(createError(400, "Course ID required"))

        const payment = await Payment.findOne({ courseId, userId: id }).sort({ createdAt: -1 })
        if (!payment) return next(createError(404, "Payment not found"))

        const timeSinceSubscribed = Date.now() - new Date(payment.createdAt).getTime()
        const refundPeriod = 14 * 24 * 60 * 60 * 1000

        if (timeSinceSubscribed <= refundPeriod) {
            try {
                const razorpay = getRazorpay()
                await razorpay.payments.refund(payment.payment_id, { speed: 'optimum' })
            } catch (e) {
                return next(createError(500, "Refund failed: " + e.message))
            }
        }

        if (!user.subscription) user.subscription = {}
        if (!user.subscription.courses) user.subscription.courses = []

        user.subscription.courses = user.subscription.courses.filter(
            c => c.courseId?.toString() !== courseId?.toString()
        )
        if (user.subscription.courses.length === 0) user.subscription.status = undefined
        await user.save()
        await payment.deleteOne()

        res.status(200).json({
            success: true,
            message: timeSinceSubscribed <= refundPeriod
                ? "Cancelled and refund initiated"
                : "Cancelled (refund period expired)"
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

export const allPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'name email avatar')
            .sort({ createdAt: -1 })

        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
        const finalMonths = {}
        monthNames.forEach(m => finalMonths[m] = 0)
        payments.forEach(p => {
            const month = monthNames[new Date(p.createdAt).getMonth()]
            finalMonths[month] += 1
        })

        res.status(200).json({
            success: true,
            message: 'All payments',
            allPayments: { items: payments, count: payments.length },
            finalMonths,
            monthlySalesRecord: Object.values(finalMonths),
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

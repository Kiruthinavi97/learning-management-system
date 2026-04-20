import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 character'],
        maxLength: [15, 'Name should be less than 15 character'],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'Please Enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 character'],
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must contain at least one uppercase, one lowercase, one digit and one special character'],
        select: false
    },
    avatar: {
        public_id: { type: String },
        secure_url: { type: String }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        // Legacy field kept for backward compatibility
        id: String,
        // Overall status - 'active' if subscribed to at least one course
        status: String,
        // ✅ Per-course subscriptions array
        courses: [{
            courseId: { type: String },
            courseTitle: { type: String },
            status: {
                type: String,
                enum: ['active', 'cancelled'],
                default: 'active'
            },
            subscribedAt: { type: Date, default: Date.now }
        }]
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods = {
    generateToken: async function () {
        return await JWT.sign(
            { id: this._id, email: this.email, subscription: this.subscription, role: this.role },
            process.env.JWT_SECRET
        )
    },
    generateResetToken: async function () {
        const resetToken = crypto.randomBytes(20).toString('hex')
        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000
        return resetToken
    },
    // ✅ Check if user is subscribed to a specific course
    isSubscribedToCourse: function (courseId) {
        if (this.role === 'ADMIN') return true
        if (!this.subscription?.courses) return false
        return this.subscription.courses.some(
            c => c.courseId?.toString() === courseId?.toString() && c.status === 'active'
        )
    }
}

const User = model('User', userSchema)
export default User

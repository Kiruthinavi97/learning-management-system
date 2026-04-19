import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import crypto from 'crypto'

const tutorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [30, 'Name should be less than 30 characters'],
        lowercase: true,
        trim: true
    },
    email: { 
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters'],
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must contain at least one uppercase, one lowercase, one digit and one special character'],
        select: false
    },
    avatar: {
        public_id: { type: String },
        secure_url: { type: String }
    },
    role: {
        type: String,
        default: 'TUTOR'
    },
    // Tutor specific fields
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    expertise: [{
        type: String,
        trim: true
    }],
    qualifications: {
        type: String,
        required: [true, 'Qualifications are required'],
        trim: true
    },
    experience: {
        type: Number,
        required: [true, 'Experience is required'],
        min: [0, 'Experience cannot be negative']
    },
    bio: {
        type: String,
        maxLength: [500, 'Bio should be less than 500 characters'],
        trim: true
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: [0, 'Rate cannot be negative']
    },
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String
    }],
    ratings: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        studentName: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    earnings: {
        total: { type: Number, default: 0 },
        history: [{
            amount: Number,
            studentName: String,
            date: { type: Date, default: Date.now },
            lessonId: String
        }]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
}, { timestamps: true })

tutorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

tutorSchema.methods = {
    generateToken: async function () {
        return await JWT.sign(
            { id: this._id, email: this.email, role: this.role },
            process.env.JWT_SECRET
        )
    },
    generateResetToken: async function () {
        const resetToken = crypto.randomBytes(20).toString('hex')
        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}

const Tutor = model('Tutor', tutorSchema)
export default Tutor

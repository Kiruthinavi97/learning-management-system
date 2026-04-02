import Tutor from '../models/tutorModel.js'
import createError from '../utils/error.js'
import { v2 } from 'cloudinary'
import fs from 'node:fs/promises'
import bcryptjs from 'bcryptjs'
import crypto from 'node:crypto'
import sendMail from '../utils/sendMail.js'

// Register Tutor
export const tutorSignup = async (req, res, next) => {
    try {
        const { name, email, password, subject, qualifications, experience, hourlyRate, bio, expertise } = req.body

        if (!name || !email || !password || !subject || !qualifications || !experience || !hourlyRate) {
            return next(createError(400, "All required fields must be filled"))
        }

        const tutorExists = await Tutor.findOne({ email })
        if (tutorExists) {
            return res.status(401).json({ success: false, message: "Email already exists" })
        }

        const tutor = new Tutor({
            name,
            email,
            password,
            subject,
            qualifications,
            experience,
            hourlyRate,
            bio,
            expertise: expertise ? expertise.split(',').map(e => e.trim()) : [],
            avatar: {
                public_id: email,
                secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
            }
        })

        if (req.file) {
            try {
                const result = await v2.uploader.upload(req.file.path, {
                    resource_type: 'image',
                    folder: 'lms/tutors',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                })
                if (result) {
                    tutor.avatar.public_id = result.public_id
                    tutor.avatar.secure_url = result.secure_url
                    fs.rm(`uploads/${req.file.filename}`)
                }
            } catch (error) {
                return next(createError(500, error.message || "File not uploaded, please try again"))
            }
        }

        await tutor.save()
        tutor.password = undefined
        const token = await tutor.generateToken()

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({
            success: true,
            message: 'Tutor account created successfully',
            token,
            tutor
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Login Tutor
export const tutorLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(createError(401, "All input fields are required"))
        }

        const tutor = await Tutor.findOne({ email }).select('+password')
        if (!tutor) {
            return next(createError(404, "Tutor with this email is not found"))
        }

        const comparePassword = await bcryptjs.compare(password, tutor.password)
        if (!comparePassword) {
            return next(createError(401, "Invalid email or password"))
        }

        const token = await tutor.generateToken()
        tutor.password = undefined

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            success: true,
            message: `Welcome back ${tutor.name}`,
            token,
            tutor
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Logout Tutor
export const tutorLogout = (req, res, next) => {
    try {
        res.cookie('token', null, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0,
        })
        res.status(200).json({
            success: true,
            message: "Tutor logged out successfully"
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Get Tutor Profile
export const getTutorProfile = async (req, res, next) => {
    try {
        const tutorId = req.user.id
        const tutor = await Tutor.findById(tutorId)
        res.status(200).json({
            success: true,
            message: 'Tutor details',
            tutor
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Update Tutor Profile
export const updateTutorProfile = async (req, res, next) => {
    try {
        const tutorId = req.user.id
        const tutor = await Tutor.findById(tutorId)

        if (!tutor) {
            return next(createError(400, "Tutor does not exist"))
        }

        const { name, subject, qualifications, experience, hourlyRate, bio, expertise } = req.body

        if (name) tutor.name = name
        if (subject) tutor.subject = subject
        if (qualifications) tutor.qualifications = qualifications
        if (experience) tutor.experience = experience
        if (hourlyRate) tutor.hourlyRate = hourlyRate
        if (bio) tutor.bio = bio
        if (expertise) tutor.expertise = expertise.split(',').map(e => e.trim())

        if (req.file) {
            await v2.uploader.destroy(tutor.avatar.public_id, { resource_type: 'image' })
            try {
                const result = await v2.uploader.upload(req.file.path, {
                    resource_type: 'image',
                    folder: 'lms/tutors',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                })
                if (result) {
                    tutor.avatar.public_id = result.public_id
                    tutor.avatar.secure_url = result.secure_url
                    fs.rm(`uploads/${req.file.filename}`)
                }
            } catch (error) {
                return next(createError(500, error.message || "File not uploaded, please try again"))
            }
        }

        await tutor.save()
        res.status(200).json({
            success: true,
            message: "Tutor profile updated successfully"
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Get All Tutors (for students to browse)
export const getAllTutors = async (req, res, next) => {
    try {
        const { subject, minRate, maxRate, minRating } = req.query

        let filter = { isActive: true }
        if (subject) filter.subject = { $regex: subject, $options: 'i' }
        if (minRate || maxRate) {
            filter.hourlyRate = {}
            if (minRate) filter.hourlyRate.$gte = Number(minRate)
            if (maxRate) filter.hourlyRate.$lte = Number(maxRate)
        }
        if (minRating) filter.ratings = { $gte: Number(minRating) }

        const tutors = await Tutor.find(filter).select('-password')
        res.status(200).json({
            success: true,
            message: 'Tutors fetched successfully',
            tutors
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Get Single Tutor
export const getSingleTutor = async (req, res, next) => {
    try {
        const { id } = req.params
        const tutor = await Tutor.findById(id).select('-password')
        if (!tutor) {
            return next(createError(404, "Tutor not found"))
        }
        res.status(200).json({
            success: true,
            tutor
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Update Availability
export const updateAvailability = async (req, res, next) => {
    try {
        const tutorId = req.user.id
        const { availability } = req.body

        const tutor = await Tutor.findById(tutorId)
        if (!tutor) {
            return next(createError(404, "Tutor not found"))
        }

        tutor.availability = availability
        await tutor.save()

        res.status(200).json({
            success: true,
            message: "Availability updated successfully"
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}

// Add Review
export const addReview = async (req, res, next) => {
    try {
        const { id } = req.params
        const { rating, comment } = req.body
        const studentId = req.user.id
        const studentName = req.user.name

        const tutor = await Tutor.findById(id)
        if (!tutor) {
            return next(createError(404, "Tutor not found"))
        }

        tutor.reviews.push({ student: studentId, studentName, rating, comment })
        tutor.totalReviews = tutor.reviews.length
        tutor.ratings = tutor.reviews.reduce((acc, r) => acc + r.rating, 0) / tutor.totalReviews

        await tutor.save()
        res.status(200).json({
            success: true,
            message: "Review added successfully"
        })
    } catch (error) {
        return next(createError(500, error.message))
    }
}
